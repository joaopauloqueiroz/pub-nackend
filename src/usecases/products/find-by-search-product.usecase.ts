import { IUseCase } from "@core/usecase";
import { Result } from "src/core/result";
import { inject, singleton } from "tsyringe";
import {
  ProductService,
  IProductService,
} from "@services/products/product.service";
import { Products } from "@prisma/client";

export type IProductSearchUseCase = IUseCase<string, Products[]>;

@singleton<IProductSearchUseCase>()
export class ProductSearchUseCase implements IProductSearchUseCase {
  constructor(
    @inject(ProductService) private productService: IProductService
  ) {}

  async execute(name: string): Promise<Result<Products[]>> {
    const products = (await this.productService.search(name)).getValue();
    console.log(name);
    return Result.ok(products);
  }
}
