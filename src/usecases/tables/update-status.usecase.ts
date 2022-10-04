import { IUseCase } from "@core/usecase";
import { Result } from "src/core/result";
import { inject, singleton } from "tsyringe";
import { ITableService, TableService } from "@services/tables/tables.service";
import { Tables } from "@prisma/client";
import { IUpdateStatus } from "./tableDTO";

export type IUpdateStatusUseCase = IUseCase<IUpdateStatus, Tables>;

@singleton<IUpdateStatusUseCase>()
export class UpdateTableStatus implements IUpdateStatusUseCase {
  constructor(@inject(TableService) private tableService: ITableService) {}

  async execute(data: IUpdateStatus): Promise<Result<Tables>> {
    const table = (
      await this.tableService.updateStatus({
        status: data.status,
        id: data.id,
      })
    ).getValue();
    return Result.ok(table);
  }
}
