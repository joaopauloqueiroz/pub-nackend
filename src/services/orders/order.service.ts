import { Result } from "@core/result";
import { Order, PrismaClient } from "@prisma/client";
import { inject, singleton } from "tsyringe";
import { ErrorCode } from "src/consts/error";
import { ILoggerFactory, ILoggerService, LoggerFactory } from "src/lib/logger";
import {
  IOrderCreate,
  IRequestByDate,
  IOrderResponse,
} from "src/usecases/order/orderDTO";

export interface IOrderService {
  create(data: IOrderCreate): Promise<Result<Order>>;
  findOne(id: string): Promise<Result<IOrderResponse>>;
  findAll(cursor?: string, take?: number): Promise<Result<Order[]>>;
  checkTable(id: string): Promise<Result<Order>>;
  close(id: string, data: any): Promise<Result<Order>>;
  listByDate(data: IRequestByDate): Promise<Result<Order[]>>;
}

@singleton<IOrderService>()
export class OrderService implements IOrderService {
  private client: PrismaClient;
  private logger: ILoggerService;

  constructor(@inject(LoggerFactory) loggerFactory: ILoggerFactory) {
    this.client = new PrismaClient();
    this.logger = loggerFactory.build("OrderService");
  }

  async create(data: IOrderCreate): Promise<Result<Order>> {
    try {
      const order = await this.client.order.create({
        data: data,
        include: { table: true },
      });
      return Result.ok(order);
    } catch (error) {
      this.logger.error(`::OrderService::create - ${error.message}`);
      return Result.fail(ErrorCode.ERROR_CREATING_PRODUCT);
    }
  }

  async findOne(id: string): Promise<Result<IOrderResponse>> {
    try {
      const order = await this.client.order.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });
      if (order) {
        return Result.ok(order as any);
      }
      return Result.ok();
    } catch (error) {
      this.logger.error(`::OrderService::create - ${error.message}`);
      return Result.fail(ErrorCode.ERROR_FINDING_PRODUCT);
    }
  }

  async findAll(cursor: "", take: number = 10): Promise<Result<Order[]>> {
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

      const products = await this.client.order.findMany(predicated);
      return Result.ok(products);
    } catch (error) {
      this.logger.error(`::OrderService::create - ${error.message}`);
      return Result.fail(ErrorCode.ERROR_FINDING_PRODUCT);
    }
  }

  async checkTable(id: string): Promise<Result<Order>> {
    const order = await this.client.order.findFirst({
      where: { tableId: id, status: "open" },
    });
    if (order) {
      return Result.ok(order);
    }
    return Result.ok();
  }

  async close(id: string, data: any): Promise<Result<Order>> {
    console.log(data);
    try {
      const order = await this.client.order.update({
        data: data,
        where: { id },
      });
      return Result.ok(order);
    } catch (error) {
      return Result.fail(ErrorCode.GENERIC_ERROR);
    }
  }

  async listByDate(data: IRequestByDate): Promise<Result<Order[]>> {
    try {
      const orders = await this.client.order.findMany({
        where: {
          createdAt: {
            gt: data.start,
            lt: data.end,
          },
          status: data.status,
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });
      return Result.ok(orders);
    } catch (error) {
      return Result.fail(ErrorCode.GENERIC_ERROR);
    }
  }
}
