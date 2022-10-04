import { Status } from "@prisma/client";

export interface ITableRequest {
  name: string;
  status: Status;
}

export interface IUpdateStatus {
  status: Status;
  id: string;
}
