import {
  ListOrderByDateAndStatus,
  OrderCreateSchema,
} from "@validations/order/create-order.schema";
import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET, POST, PUT } from "fastify-decorators";
import { Authorization } from "src/decorators/authorization";
import {
  CloseOrderUseCase,
  IOrderCloseUseCase,
} from "src/usecases/order/close-order.usecase";
import {
  IOrderCreateUseCase,
  OrderCreateUseCase,
} from "src/usecases/order/create-order.usecase";
import {
  FindOrderByIdUseCase,
  IFindOrderByIdUseCase,
} from "src/usecases/order/find-order-by-id.usecase";
import {
  IListOrdersyDateUseCase,
  ListAllOrdersByDateUseCase,
} from "src/usecases/order/list-all-orders-by-date.usecase";
import { IOrderRequest, IRequestByDate } from "src/usecases/order/orderDTO";
import { container } from "tsyringe";

@Controller("/orders")
export default class OrderController {
  private readonly orderCreateUseCase: IOrderCreateUseCase;
  private readonly findOrderByIdUseCase: IFindOrderByIdUseCase;
  private readonly closeOrderUseCase: IOrderCloseUseCase;
  private readonly listAllOrderClosedsByDate: IListOrdersyDateUseCase;
  constructor() {
    this.orderCreateUseCase =
      container.resolve<IOrderCreateUseCase>(OrderCreateUseCase);

    this.findOrderByIdUseCase =
      container.resolve<IFindOrderByIdUseCase>(FindOrderByIdUseCase);

    this.closeOrderUseCase =
      container.resolve<IOrderCloseUseCase>(CloseOrderUseCase);

    this.listAllOrderClosedsByDate = container.resolve<IListOrdersyDateUseCase>(
      ListAllOrdersByDateUseCase
    );
  }

  @Authorization
  @POST("", {
    schema: {
      body: OrderCreateSchema,
    },
  })
  async handleOrderCreate(req: FastifyRequest, res: FastifyReply) {
    const response = await this.orderCreateUseCase.execute(
      req.body as IOrderRequest
    );
    return response.send(201, res);
  }

  @Authorization
  @GET("/:id")
  async handleFindOrderById(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as any;
    const response = await this.findOrderByIdUseCase.execute(id as string);
    return response.send(201, res);
  }

  @Authorization
  @PUT("/close/:id")
  async handleCloseOrder(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as any;
    const response = await this.closeOrderUseCase.execute(id as string);
    return response.send(201, res);
  }

  @Authorization
  @POST("/all", { schema: { body: ListOrderByDateAndStatus } })
  async handleAll(req: FastifyRequest, res: FastifyReply) {
    const data = req.body;
    const response = await this.listAllOrderClosedsByDate.execute(
      data as IRequestByDate
    );
    return response.send(201, res);
  }
}
