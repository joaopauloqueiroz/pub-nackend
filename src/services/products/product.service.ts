import { Result } from "@core/result";
import { IProductRequest } from "@usecases/products/productDTO";
import { PrismaClient, Products } from "@prisma/client";
import { inject, singleton } from "tsyringe";
import { ErrorCode } from "src/consts/error";
import { ILoggerFactory, ILoggerService, LoggerFactory } from "src/lib/logger";

export interface IProductService {
  create(data: IProductRequest): Promise<Result<Products>>;
  findOne(id: string): Promise<Result<Products>>;
  findAll(cursor?: string, take?: number): Promise<Result<Products[]>>;
}

@singleton<IProductService>()
export class ProductService implements IProductService {
  private client: PrismaClient;
  private logger: ILoggerService;

  constructor(@inject(LoggerFactory) loggerFactory: ILoggerFactory) {
    this.client = new PrismaClient();
    this.logger = loggerFactory.build("ProductService");
  }

  async create(data: IProductRequest): Promise<Result<Products>> {
    try {
      const product = await this.client.products.create({ data: data });
      return Result.ok(product);
    } catch (error) {
      this.logger.error(`::ProductService::create - ${error.message}`);
      return Result.fail(ErrorCode.ERROR_CREATING_PRODUCT);
    }
  }

  async findOne(id: string): Promise<Result<Products>> {
    try {
      const product = await this.client.products.findFirst({ where: { id } });
      if (product) {
        return Result.ok(product);
      }
      return Result.ok();
    } catch (error) {
      this.logger.error(`::ProductService::create - ${error.message}`);
      return Result.fail(ErrorCode.ERROR_FINDING_PRODUCT);
    }
  }

  async findAll(cursor: "", take: number = 10): Promise<Result<Products[]>> {
    try {
      let predicated = {
        take: Number(take),
      };

      if (cursor) {
        predicated = Object.assign(predicated, {
          cursor: {
            id: cursor,
          },
        });
      }

      const products = await this.client.products.findMany(predicated);
      return Result.ok(products);
    } catch (error) {
      this.logger.error(`::ProductService::create - ${error.message}`);
      return Result.fail(ErrorCode.ERROR_FINDING_PRODUCT);
    }
  }
}
