import { IUseCase } from "@core/usecase";
import { Result } from "src/core/result";
import { inject, singleton } from "tsyringe";
import {
  ProductService,
  IProductService,
} from "@services/products/product.service";
import { Products } from "@prisma/client";

export type IProductFindByIdUseCase = IUseCase<string, Products>;

@singleton<IProductFindByIdUseCase>()
export class ProductFindById implements IProductFindByIdUseCase {
  constructor(
    @inject(ProductService) private productService: IProductService
  ) {}

  async execute(id: string): Promise<Result<Products>> {
    const product = (await this.productService.findOne(id)).getValue();
    return Result.ok(product);
  }
}
