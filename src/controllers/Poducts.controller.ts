import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET, POST } from "fastify-decorators";
import { Authorization } from "@decorators/authorization";
import { ProductCreateSchema } from "@validations/products/create-product.schema";
import {
  IProductCreateUseCase,
  ProductCreateUseCase,
} from "@usecases/products/product-create.usecase";
import { container } from "tsyringe";
import { IProductRequest } from "@usecases/products/productDTO";
import {
  IProductFindByIdUseCase,
  ProductFindById,
} from "@usecases/products/find-by-id-product.usecase";
import {
  FindProductAllUseCase,
  IPagination,
  IProductAllUseCase,
} from "@usecases/products/find-all-products.usecase";

@Controller("/products")
export default class UserController {
  private readonly productCreateUseCase: IProductCreateUseCase;
  private readonly productFindByIdUseCase: IProductFindByIdUseCase;
  private readonly findProductAllUseCase: IProductAllUseCase;

  constructor() {
    this.productCreateUseCase =
      container.resolve<IProductCreateUseCase>(ProductCreateUseCase);

    this.productFindByIdUseCase =
      container.resolve<IProductFindByIdUseCase>(ProductFindById);

    this.findProductAllUseCase = container.resolve<IProductAllUseCase>(
      FindProductAllUseCase
    );
  }

  @Authorization
  @POST("", { schema: { body: ProductCreateSchema } })
  async handlerCreate(req: FastifyRequest, res: FastifyReply) {
    const product = req.body;
    const response = await this.productCreateUseCase.execute(
      product as IProductRequest
    );
    response.send(201, res);
  }

  @Authorization
  @GET("/:id")
  async handlerFindById(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as any;
    const response = await this.productFindByIdUseCase.execute(id);
    response.send(201, res);
  }

  @Authorization
  @GET("/all")
  async handlerFindAll(req: FastifyRequest, res: FastifyReply) {
    const response = await this.findProductAllUseCase.execute(
      req.query as IPagination
    );
    response.send(201, res);
  }
}
