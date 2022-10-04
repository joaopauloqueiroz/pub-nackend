import { IUseCase } from "@core/usecase";
import { Result } from "src/core/result";
import { inject, singleton } from "tsyringe";
import { OrderItems } from "@prisma/client";
import {
  IOrderItemService,
  OrderItemService,
} from "src/services/orderItems/order-item.service";

export type IOrderItemDeleteUseCase = IUseCase<string, OrderItems>;

@singleton<IOrderItemDeleteUseCase>()
export class OrderItemDeleteUseCase implements IOrderItemDeleteUseCase {
  constructor(
    @inject(OrderItemService) private orderItemService: IOrderItemService
  ) {}

  async execute(id: string): Promise<Result<OrderItems>> {
    const orderItem = (await this.orderItemService.remove(id)).getValue();
    return Result.ok(orderItem);
  }
}
