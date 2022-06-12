import { Result } from "@core/result";
import { ITableRequest } from "@usecases/tables/tableDTO";
import { PrismaClient, Tables } from "@prisma/client";
import { inject, singleton } from "tsyringe";
import { ErrorCode } from "src/consts/error";
import { ILoggerFactory, ILoggerService, LoggerFactory } from "src/lib/logger";

export interface ITableService {
  create(data: ITableRequest): Promise<Result<Tables>>;
  findOne(id: string): Promise<Result<Tables>>;
  findAll(): Promise<Result<Tables[]>>;
}

@singleton<ITableService>()
export class TableService implements ITableService {
  private client: PrismaClient;
  private logger: ILoggerService;

  constructor(@inject(LoggerFactory) loggerFactory: ILoggerFactory) {
    this.client = new PrismaClient();
    this.logger = loggerFactory.build("TableService");
  }

  async create(data: ITableRequest): Promise<Result<Tables>> {
    try {
      const table = await this.client.tables.create({ data: data });
      return Result.ok(table);
    } catch (error) {
      this.logger.error(`::TableService::create - ${error.message}`);
      return Result.fail(ErrorCode.ERROR_CREATING_TABLE);
    }
  }

  async findOne(id: string): Promise<Result<Tables>> {
    try {
      const table = await this.client.tables.findFirst({ where: { id } });
      if (table) {
        return Result.ok(table);
      }
      return Result.ok();
    } catch (error) {
      this.logger.error(`::TableService::create - ${error.message}`);
      return Result.fail(ErrorCode.ERROR_FINDING_TABLE);
    }
  }

  async findAll(): Promise<Result<Tables[]>> {
    try {
      const tables = await this.client.tables.findMany();
      return Result.ok(tables);
    } catch (error) {
      this.logger.error(`::ProductService::create - ${error.message}`);
      return Result.fail(ErrorCode.ERROR_FINDING_TABLE);
    }
  }
}
