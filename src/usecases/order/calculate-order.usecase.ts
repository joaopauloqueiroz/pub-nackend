import { IUseCase } from "@core/usecase";
import { Result } from "src/core/result";
import { inject, singleton } from "tsyringe";
import { OrderItems } from "@prisma/client";
import {
  IOrderItemService,
  OrderItemService,
} from "src/services/orderItems/order-item.service";
export type IOrderItemCalulateUseCase = IUseCase<string, OrderItems[]>;

@singleton<IOrderItemCalulateUseCase>()
export class OrderItemCalculateUseCase implements IOrderItemCalulateUseCase {
  constructor(
    @inject(OrderItemService) private orderItemService: IOrderItemService
  ) {}

  async execute(id: string): Promise<Result<OrderItems[]>> {
    const orderItems = (await this.orderItemService.findByOrder(id)).getValue();
    return Result.ok(orderItems);
  }
}
