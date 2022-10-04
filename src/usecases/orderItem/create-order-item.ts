import { IUseCase } from "@core/usecase";
import { Result } from "src/core/result";
import { inject, singleton } from "tsyringe";
import { IOrderItemRequest } from "./orderItemsDTO";
import { OrderItems } from "@prisma/client";
import {
  IOrderItemService,
  OrderItemService,
} from "src/services/orderItems/order-item.service";

export type IOrderItemCreateUseCase = IUseCase<IOrderItemRequest, OrderItems>;

@singleton<IOrderItemCreateUseCase>()
export class OrderItemCreateUseCase implements IOrderItemCreateUseCase {
  constructor(
    @inject(OrderItemService) private orderItemService: IOrderItemService
  ) {}

  async execute(data: IOrderItemRequest): Promise<Result<OrderItems>> {
    const orderItem = (await this.orderItemService.create(data)).getValue();
    return Result.ok(orderItem);
  }
}
