import { IUseCase } from "@core/usecase";
import { Result } from "src/core/result";
import { inject, singleton } from "tsyringe";
import {
  ProductService,
  IProductService,
} from "@services/products/product.service";
import { Products } from "@prisma/client";
export interface IPagination {
  cursor?: string;
  take?: number;
}

export type IProductAllUseCase = IUseCase<IPagination, Products[]>;

@singleton<IProductAllUseCase>()
export class FindProductAllUseCase implements IProductAllUseCase {
  constructor(
    @inject(ProductService) private productService: IProductService
  ) {}

  async execute(pagination: IPagination): Promise<Result<Products[]>> {
    const product = (
      await this.productService.findAll(
        pagination.cursor,
        pagination.take as number
      )
    ).getValue();
    return Result.ok(product);
  }
}
