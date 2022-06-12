import { IUseCase } from "@core/usecase";
import { IStripe, StripeService } from "@services/stripe";
import { Result } from "src/core/result";
import Stripe from "stripe";
import { inject, singleton } from "tsyringe";

export type IPriceCreateUseCase = IUseCase<
  Stripe.PriceCreateParams,
  Stripe.Price
>;
@singleton<IPriceCreateUseCase>()
export class PriceCreateUseCase implements IPriceCreateUseCase {
  constructor(@inject(StripeService) private stripeService: IStripe) {}
  async execute(data: Stripe.PriceCreateParams): Promise<Result<Stripe.Price>> {
    const price = await this.stripeService.createPrice(data);
    return Result.ok(price);
  }
}
