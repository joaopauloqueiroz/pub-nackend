import {
  ITableCreateUseCase,
  TableCreateUseCase,
} from "@usecases/tables/create-table.usecase";
import { TableCreateSchema } from "@validations/tables/create-table.schema";
import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET, POST } from "fastify-decorators";
import { Authorization } from "src/decorators/authorization";
import { container } from "tsyringe";
import { ITableRequest } from "src/usecases/tables/tableDTO";
import {
  IFindTableAllUseCase,
  FindTableAllUseCase,
} from "@usecases/tables/find-all-tables.usecase";
import {
  ITableFindByIdUseCase,
  TableFindById,
} from "@usecases/tables/find-by-id-table.usecase";

@Controller("/tables")
export default class PricesController {
  private readonly tableCreateUseCase: ITableCreateUseCase;
  private readonly tableFindAllUseCase: IFindTableAllUseCase;
  private readonly tableFindByIdUseCase: ITableFindByIdUseCase;
  constructor() {
    this.tableCreateUseCase =
      container.resolve<ITableCreateUseCase>(TableCreateUseCase);

    this.tableFindAllUseCase =
      container.resolve<IFindTableAllUseCase>(FindTableAllUseCase);

    this.tableFindByIdUseCase =
      container.resolve<ITableFindByIdUseCase>(TableFindById);
  }

  @Authorization
  @POST("", { schema: { body: TableCreateSchema } })
  async handleTableCreate(req: FastifyRequest, res: FastifyReply) {
    const response = await this.tableCreateUseCase.execute(
      req.body as ITableRequest
    );
    return response.send(201, res);
  }

  @Authorization
  @GET("/:id")
  async handleTableBytId(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as any;
    const response = await this.tableFindByIdUseCase.execute(id);
    return response.send(201, res);
  }

  @Authorization
  @GET("/all")
  async handleTableAll(req: FastifyRequest, res: FastifyReply) {
    const response = await this.tableFindAllUseCase.execute(null);
    return response.send(201, res);
  }
}
