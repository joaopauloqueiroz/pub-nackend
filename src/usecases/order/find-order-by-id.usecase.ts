import { IUseCase } from "@core/usecase";
import { Result } from "src/core/result";
import { inject, singleton } from "tsyringe";
import { Order, OrderItems, Products } from "@prisma/client";
import { IOrderService, OrderService } from "src/services/orders/order.service";
import {
  IOrderItemCalulateUseCase,
  OrderItemCalculateUseCase,
} from "./calculate-order.usecase";
export interface OrderProducts extends Order {
  products: Products[];
}
export interface OrderResponse {
  order: Order;
  total: string;
  amount: string;
}

export interface OrderItemCalculate extends OrderItems {
  product: Products;
}
export type IFindOrderByIdUseCase = IUseCase<string, OrderResponse>;

@singleton<IFindOrderByIdUseCase>()
export class FindOrderByIdUseCase implements IFindOrderByIdUseCase {
  constructor(
    @inject(OrderService) private orderService: IOrderService,
    @inject(OrderItemCalculateUseCase)
    private orderItemCalculateUseCase: IOrderItemCalulateUseCase
  ) {}

  async execute(id: string): Promise<Result<OrderResponse>> {
    const order = (await this.orderService.findOne(id)).getValue() as Order & {
      orderItems: (OrderItems & {
        product: Products;
      })[];
    };

    const total = this.calculateOrder(
      order?.orderItems as OrderItemCalculate[]
    );

    const amount = Number(total) - Number(order?.discount);

    return Result.ok({
      order,
      amount: amount?.toFixed(2),
      total: total?.toFixed(2),
    } as OrderResponse);
  }

  private calculateOrder(productsOrderItems: OrderItemCalculate[]): number {
    const amount = productsOrderItems?.reduce(
      (prevValue, actualValue) =>
        (prevValue += Number(actualValue.product.price) * actualValue.quantity),
      0
    );

    return amount;
  }
}
