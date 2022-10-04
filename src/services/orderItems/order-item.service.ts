import { Result } from "@core/result";
import { OrderItems, PrismaClient } from "@prisma/client";
import { inject, singleton } from "tsyringe";
import { ErrorCode } from "src/consts/error";
import { ILoggerFactory, ILoggerService, LoggerFactory } from "src/lib/logger";
import { IOrderItemRequest } from "@usecases/orderItem/orderItemsDTO";

export interface IOrderItemService {
  create(data: IOrderItemRequest): Promise<Result<OrderItems>>;
  findOne(id: string): Promise<Result<OrderItems>>;
  findAll(cursor?: string, take?: number): Promise<Result<OrderItems[]>>;
  remove(id: string): Promise<Result<OrderItems>>;
  findByOrder(id: string): Promise<Result<OrderItems[]>>;
}

@singleton<IOrderItemService>()
export class OrderItemService implements IOrderItemService {
  private client: PrismaClient;
  private logger: ILoggerService;

  constructor(@inject(LoggerFactory) loggerFactory: ILoggerFactory) {
    this.client = new PrismaClient();
    this.logger = loggerFactory.build("OrderItemService");
  }

  async create(data: IOrderItemRequest): Promise<Result<OrderItems>> {
    try {
      const orderItem = await this.client.orderItems.create({ data });
      return Result.ok(orderItem);
    } catch (error) {
      this.logger.error(`::OrderItemService::create - ${error.message}`);
      return Result.fail(ErrorCode.ERROR_CREATING_PRODUCT);
    }
  }

  async findOne(id: string): Promise<Result<OrderItems>> {
    try {
      const orderItem = await this.client.orderItems.findFirst({
        where: { orderId: id },
        include: {
          product: true,
        },
      });
      if (orderItem) {
        return Result.ok(orderItem);
      }
      return Result.ok();
    } catch (error) {
      this.logger.error(`::OrderItemService::findOne - ${error.message}`);
      return Result.fail(ErrorCode.ERROR_FINDING_PRODUCT);
    }
  }

  async findAll(cursor: "", take: number = 10): Promise<Result<OrderItems[]>> {
    try {
      let predicated = {
        take: Number(take),
      };

      if (cursor) {
        predicated = Object.assign(predicated, {
          cursor: {
            id: cursor,
          },
        });
      }

      const orderItems = await this.client.orderItems.findMany(predicated);
      return Result.ok(orderItems);
    } catch (error) {
      this.logger.error(`::OrderItemService::findAll - ${error.message}`);
      return Result.fail(ErrorCode.ERROR_FINDING_PRODUCT);
    }
  }

  async remove(id: string): Promise<Result<OrderItems>> {
    try {
      const orderItem = await this.client.orderItems.delete({ where: { id } });
      return Result.ok(orderItem);
    } catch (error) {
      return Result.fail(ErrorCode.ERROR_DELETING_ORDERITEM);
    }
  }

  async findByOrder(id: string): Promise<Result<OrderItems[]>> {
    try {
      const orderItems = await this.client.orderItems.findMany({
        where: { orderId: id },
        include: {
          product: true,
        },
      });
      if (orderItems) {
        return Result.ok(orderItems);
      }
      return Result.ok();
    } catch (error) {
      this.logger.error(`::OrderItemService::findOne - ${error.message}`);
      return Result.fail(ErrorCode.ERROR_FINDING_PRODUCT);
    }
  }
}
