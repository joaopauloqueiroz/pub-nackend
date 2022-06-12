import { IUseCase } from "@core/usecase";
import { Result } from "src/core/result";
import { inject, singleton } from "tsyringe";
import { ITableService, TableService } from "@services/tables/tables.service";
import { Products, Tables } from "@prisma/client";

export type ITableFindByIdUseCase = IUseCase<string, Tables>;

@singleton<ITableFindByIdUseCase>()
export class TableFindById implements ITableFindByIdUseCase {
  constructor(@inject(TableService) private tableService: ITableService) {}

  async execute(id: string): Promise<Result<Tables>> {
    const table = (await this.tableService.findOne(id)).getValue();
    return Result.ok(table);
  }
}
