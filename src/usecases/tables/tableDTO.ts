import { Status } from "@prisma/client";

export interface ITableRequest {
  name: string;
  status: Status;
}
