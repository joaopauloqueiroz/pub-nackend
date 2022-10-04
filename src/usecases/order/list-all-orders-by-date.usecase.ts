import { IUseCase } from "@core/usecase";
import { Result } from "src/core/result";
import { inject, singleton } from "tsyringe";
import { Order, OrderItems, Products } from "@prisma/client";
import { IOrderService, OrderService } from "src/services/orders/order.service";
import {
  IOrderItemCalulateUseCase,
  OrderItemCalculateUseCase,
} from "./calculate-order.usecase";
import { IRequestByDate } from "./orderDTO";
export interface OrderProducts extends Order {
  products: Products[];
}

export interface OrderItemCalculate extends OrderItems {
  product: Products;
}
export type IListOrdersyDateUseCase = IUseCase<IRequestByDate, Order[]>;

@singleton<IListOrdersyDateUseCase>()
export class ListAllOrdersByDateUseCase implements IListOrdersyDateUseCase {
  constructor(@inject(OrderService) private orderService: IOrderService) {}

  async execute(data: IRequestByDate): Promise<Result<Order[]>> {
    const orders = (await this.orderService.listByDate(data)).getValue();
    return Result.ok(orders);
  }
}
