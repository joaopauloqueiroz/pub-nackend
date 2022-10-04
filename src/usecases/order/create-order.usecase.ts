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

export type IOrderCreateUseCase = IUseCase<IOrderRequest, Order>;

@singleton<IOrderCreateUseCase>()
export class OrderCreateUseCase implements IOrderCreateUseCase {
  constructor(
    @inject(OrderService) private orderService: IOrderService,
    @inject(TableService) private tableService: ITableService,
    @inject(UpdateTableStatus)
    private updateStatusTableUseCase: IUpdateStatusUseCase
  ) {}

  async execute(data: IOrderRequest): Promise<Result<Order>> {
    const session = SessionService.getSession();
    const tableAlreadyExists = await this.orderService.checkTable(data.tableId);

    if (tableAlreadyExists.getValue()) {
      return Result.fail(ErrorCode.ERROR_CHECKING_TABLE);
    }
    const order = (
      await this.orderService.create(
        Object.assign(data, { userId: session.user.id })
      )
    ).getValue();

    await this.updateStatusTableUseCase.execute({
      id: data.tableId,
      status: "open",
    });

    const table = (await this.tableService.findOne(data.tableId)).getValue();

    return Result.ok(table as any);
  }
}
