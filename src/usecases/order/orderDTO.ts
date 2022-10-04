import {
  Order,
  OrderItems,
  Products,
  Status,
  StatusOrder,
  User,
} from "@prisma/client";

export interface IOrderRequest {
  status: StatusOrder;
  discount?: number;
  responsible: string;
  tableId: string;
}

export interface IOrderCreate extends IOrderRequest {
  userId: string;
}

export interface ICloseOrder {
  orderId: string;
}

export interface IRequestByDate {
  start: string;
  end: string;
  status: StatusOrder;
}

export interface IOrderResponse extends Order {
  orderItems: (OrderItems & {
    product: Products;
  })[];
  user: {
    id: string;
    name: string;
    email: string;
  };
}
