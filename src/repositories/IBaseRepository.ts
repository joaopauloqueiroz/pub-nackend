import { PrismaClient } from "@prisma/client";

export interface IBaseRepository<T> {
  insert(predicate: any): Promise<T>;
  find(predicate): Promise<T[]>;
  findOne(prdicate): Promise<T>;
  delete(predicate): Promise<T>;
}
export class BaseRepository<T extends PrismaClient>
  implements IBaseRepository<T>
{
  constructor() {}
  async insert(predicate: any): Promise<T> {
    return;
  }

  findOne(prdicate: any): Promise<T> {}

  find(predicate: any): Promise<T[]> {}

  delete(predicate: any): Promise<T> {}
}
