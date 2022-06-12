import {
  IPriceCreateUseCase,
  PriceCreateUseCase,
} from "@usecases/prices/create-price.usecase";
import { PriceCreateSchema } from "@validations/prices/create-prices.schema";
import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, POST } from "fastify-decorators";
import { Authorization } from "src/decorators/authorization";
import Stripe from "stripe";
import { container } from "tsyringe";

@Controller("/prices")
export default class PricesController {
  private readonly pricesCreate: IPriceCreateUseCase;
  constructor() {
    this.pricesCreate =
      container.resolve<IPriceCreateUseCase>(PriceCreateUseCase);
  }

  @Authorization
  @POST("", { schema: { body: PriceCreateSchema } })
  async handlePriceCreate(req: FastifyRequest, res: FastifyReply) {
    const response = await this.pricesCreate.execute(
      req.body as Stripe.PriceCreateParams
    );
    response.send(201, res);
  }
}
