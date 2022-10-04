import { OrderItemCreateSchema } from "@validations/orderItem/create-order-item.schema";
import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, DELETE, GET, POST } from "fastify-decorators";
import { Authorization } from "src/decorators/authorization";
import {
  IOrderItemCalulateUseCase,
  OrderItemCalculateUseCase,
} from "src/usecases/order/calculate-order.usecase";
import {
  IOrderItemCreateUseCase,
  OrderItemCreateUseCase,
} from "src/usecases/orderItem/create-order-item";
import {
  IOrderItemDeleteUseCase,
  OrderItemDeleteUseCase,
} from "src/usecases/orderItem/delete-order-item.usecase";
import { IOrderItemRequest } from "src/usecases/orderItem/orderItemsDTO";
import { container } from "tsyringe";

@Controller("/order-items")
export default class OrderController {
  private readonly orderItemCreateUseCase: IOrderItemCreateUseCase;
  private readonly orderItemDeleteUseCase: IOrderItemDeleteUseCase;
  private readonly orderItemCalculateUseCase: IOrderItemDeleteUseCase;

  constructor() {
    this.orderItemCreateUseCase = container.resolve<IOrderItemCreateUseCase>(
      OrderItemCreateUseCase
    );

    this.orderItemDeleteUseCase = container.resolve<IOrderItemDeleteUseCase>(
      OrderItemDeleteUseCase
    );
  }

  @Authorization
  @POST("", { schema: { body: OrderItemCreateSchema } })
  async handleOrderCreate(req: FastifyRequest, res: FastifyReply) {
    const response = await this.orderItemCreateUseCase.execute(
      req.body as IOrderItemRequest
    );
    return response.send(201, res);
  }

  @Authorization
  @DELETE("/:id")
  async handleOrderItemDelete(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as any;
    const response = await this.orderItemDeleteUseCase.execute(id as string);
    return response.send(201, res);
  }

  @Authorization
  @GET("/:id")
  async handleOrderItemCalculate(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as any;
    const response = await this.orderItemCalculateUseCase.execute(id as string);
    return response.send(201, res);
  }
}
