import ApiError from "@consts/error";
import context from "@lib/async-context";
import { ILoggerFactory, ILoggerService, LoggerFactory } from "@lib/logger";
import Ajv from "avj";
import "dotenv/config";
import fastify, { FastifyInstance } from "fastify";
import fastifyCors from "fastify-cors";
import { bootstrap } from "fastify-decorators";
import fastifyFormBody from "fastify-formbody";
import { fastifyHelmet } from "fastify-helmet";
import { IncomingMessage, Server, ServerResponse } from "http";
import { ValidatorResult } from "jsonschema";
import middie from "middie";
import { resolve } from "path";
import { inject, singleton } from "tsyringe";
import { v4 as uuidv4 } from "uuid";
import swagger from "fastify-swagger";

export type FastifyServer = FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
>;

export interface IAppFactory {
  build(): Promise<IAppFactory>;
  listen(port: string): Promise<void>;
}

@singleton<IAppFactory>()
export class App implements IAppFactory {
  private readonly logger: ILoggerService;
  private server: FastifyInstance;

  constructor(@inject(LoggerFactory) loggerFactory: ILoggerFactory) {
    this.logger = loggerFactory.build("app");
  }

  listen(port: string): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(parseInt(port), "0.0.0.0");

      this.server.addHook("onReady", () => {
        this.logger.info(`Server listening on ${port}`);
        resolve();
      });
    });
  }

  async build(): Promise<IAppFactory> {
    this.server = await fastify({
      disableRequestLogging: true,
      requestIdHeader: "x-request-id",
      genReqId: (req) => {
        return (req.headers["x-request-id"] || uuidv4()) as string;
      },
      logger: {
        serializers: {
          req: function (req) {
            return {
              requestMethod: req.method,
              requestUrl: req.url,
              remoteIp: req.socket.address,
              userAgent: req.headers["user-agent"],
            };
          },
        },
      },
    });

    await this.registerAll();

    this.addUse();
    this.addHooks();
    this.loadRoutes();

    return Promise.resolve(this);
  }

  private async registerAll(): Promise<void> {
    await this.server.register(middie);
    await this.server.register(fastifyCors);
    await this.server.register(fastifyHelmet);
    await this.server.register(swagger, {
      routePrefix: "/documentation",
      swagger: {
        info: {
          title: "Test swagger",
          description: "Testing the Fastify swagger API",
          version: "0.1.0",
        },
        externalDocs: {
          url: "https://swagger.io",
          description: "Find more info here",
        },
        host: "localhost",
        schemes: ["http"],
        consumes: ["application/json"],
        produces: ["application/json"],
        tags: [{ name: "Orders", description: "Code related end-points" }],
        securityDefinitions: {
          apiKey: {
            type: "apiKey",
            name: "apiKey",
            in: "header",
          },
        },
      },
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
      },
      uiHooks: {
        onRequest: function (request, reply, next) {
          next();
        },
        preHandler: function (request, reply, next) {
          next();
        },
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      exposeRoute: true,
    });
    // await this.server.register(fastifyMultipart, { attachFieldsToBody: true });
    await this.server.register(fastifyFormBody);
  }

  private async addUse(): Promise<void> {
    this.server.use((req: any, res, next) => {
      const requestId = req.id;
      const store = new Map();
      store.set("requestId", requestId);
      req.context = context;

      return context.run(store, next);
    });
  }

  private addHooks(): void {
    this.server.addHook("onSend", async (req, reply) => {
      reply.header("x-request-id", req.id);
    });

    this.server.addHook("onError", async (req, reply, error) => {
      if (error instanceof ApiError) {
        const apiError = error as ApiError;

        reply.status(apiError.status).send({
          code: apiError.code,
          message: apiError.message,
          status: apiError.status,
          instance: req.url,
        });
      } else if (error instanceof ValidatorResult) {
        const errors = error.errors.map((error) => {
          return `${error.property} - ${error.message}`;
        });

        reply.status(400).send({
          error: {
            errors,
          },
          code: 400,
          message: "Error on validate fields",
        });
      } else if (error.validation) {
        reply.status(400).send({
          code: 400,
          message: "Invalid parameters",
          errors: error.validation,
        });
      } else {
        this.logger.error(
          `::app:: - ${JSON.stringify(
            error,
            Object.getOwnPropertyNames(error)
          )}`
        );

        reply.status(500).send({
          code: 500,
          title: error.message,
        });
      }
    });

    this.server.addHook("onResponse", (req, res, next) => {
      const httpRequest = {
        requestMethod: req.method,
        requestUrl: req.url,
        remoteIp: req.socket.address,
        userAgent: req.headers["user-agent"],
        status: res.statusCode,
        latency: (res.getResponseTime() / 1000).toFixed(9) + "s",
        responseSize: res.getHeader("Content-Length"),
      };

      this.server.log.info({
        labels: {
          requestId: req.id,
        },
        "logging.googleapis.com/sourceLocation":
          (req as any)?.context.config.url || req.url,
        "logging.googleapis.com/spanId": req.id,
        httpRequest,
      });
      next();
    });
  }

  private async loadRoutes(): Promise<void> {
    this.server.register(bootstrap, {
      directory: resolve(__dirname, ".."),
      mask: /\.controller\.[j|t]s$/,
    });

    this.server.get("/", (req, res) => {
      res.type("text/html").send(`
<html>
<style>
body {
  margin: 0;
}

div {
  width: 300px;
  height: 100px;
}

.x {
  animation: x 52s linear infinite alternate;
}

.y {
  animation: y 28s linear infinite alternate;
}

@keyframes x {
  100% {
    transform: translateX( calc(100vw - 100px) );
  }
}

@keyframes y {
  100% {
    transform: translateY( calc(100vh - 100px) );
  }
}
</style>
<body>
<div class="x">
<pre class="y">
 _   _ _      _               _   _           _
| | | (_)    (_)             | \\ | |         | |
| |_| |_ _ __ _ _ __   __ _  |  \\| | _____  _| |_
|  _  | | '__| | '_ \\ / _\` | | . \` |/ _ \\ \\/ / __|
| | | | | |  | | | | | (_| | | |\\  |  __/>  <| |_
\\_| |_/_|_|  |_|_| |_|\\__, | \\_| \\_/\\___/_/\\_\\\\__|
                       __/ |
                      |___/
</pre>
</div>
</body>
</html>
    `);
    });
  }
}
