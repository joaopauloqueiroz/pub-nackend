import { IUseCase } from "@core/usecase";
import { IStripe, StripeService } from "@services/stripe";
import { Result } from "src/core/result";
import Stripe from "stripe";
import { inject, singleton } from "tsyringe";
import {
  ProductService,
  IProductService,
} from "@services/products/product.service";
import { IProductRequest } from "./productDTO";
import { Products } from "@prisma/client";

export type IProductCreateUseCase = IUseCase<IProductRequest, Products>;

@singleton<IProductCreateUseCase>()
export class ProductCreateUseCase implements IProductCreateUseCase {
  constructor(
    @inject(ProductService) private productService: IProductService
  ) {}

  async execute(data: IProductRequest): Promise<Result<Products>> {
    const product = (await this.productService.create(data)).getValue();
    return Result.ok(product);
  }
}
