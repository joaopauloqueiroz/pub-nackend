import { IUseCase } from "@core/usecase";
import { Result } from "src/core/result";
import { inject, singleton } from "tsyringe";
import { ITableService, TableService } from "@services/tables/tables.service";
import { Tables } from "@prisma/client";

export type IFindTableAllUseCase = IUseCase<null, Tables[]>;

@singleton<IFindTableAllUseCase>()
export class FindTableAllUseCase implements IFindTableAllUseCase {
  constructor(@inject(TableService) private tableService: ITableService) {}

  async execute(data: null): Promise<Result<Tables[]>> {
    const table = (await this.tableService.findAll()).getValue();
    return Result.ok(table);
  }
}
