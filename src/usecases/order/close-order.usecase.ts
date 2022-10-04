import { IUseCase } from "@core/usecase";
import { Result } from "src/core/result";
import { inject, singleton } from "tsyringe";
import { IOrderRequest } from "./orderDTO";
import { Order } from "@prisma/client";
import { IOrderService, OrderService } from "src/services/orders/order.service";
import { SessionService } from "@services/session/session.service";
import { ITableService, TableService } from "@services/tables/tables.service";
import { ErrorCode } from "src/consts/error";
import {
  IUpdateStatusUseCase,
  UpdateTableStatus,
} from "../tables/update-status.usecase";
import { OrderItemCalculate } from "./find-order-by-id.usecase";

export type IOrderCloseUseCase = IUseCase<string, Order>;

@singleton<IOrderCloseUseCase>()
export class CloseOrderUseCase implements IOrderCloseUseCase {
  constructor(
    @inject(OrderService) private orderService: IOrderService,
    @inject(TableService) private tableService: ITableService,
    @inject(UpdateTableStatus)
    private updateStatusTableUseCase: IUpdateStatusUseCase
  ) {}

  async execute(id: string): Promise<Result<Order>> {
    const orderToAmount = (await this.orderService.findOne(id)).getValue();

    const amount = this.calculateOrder(
      orderToAmount?.orderItems as OrderItemCalculate[]
    );

    const order = (
      await this.orderService.close(id, { status: "closed", amount })
    ).getValue();

    await this.tableService.close(order?.tableId, { status: "closed" });
    return Result.ok(order);
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
