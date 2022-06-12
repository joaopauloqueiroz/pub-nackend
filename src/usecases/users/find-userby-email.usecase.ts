import { Result } from "@core/result";
import { IUseCase } from "@core/usecase";
import { PrismaClient, User } from "@prisma/client";
import { singleton } from "tsyringe";

export type IFindUserByEmail = IUseCase<IParam, User | null>;

export interface IParam {
  email: string;
}
@singleton<IFindUserByEmail>()
export class FindUserByEmail implements IFindUserByEmail {
  private readonly prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }
  async execute(data: IParam): Promise<Result<User | null>> {
    const user = await this.prismaClient.user.findFirst({
      where: { email: data.email },
    });
    return Result.ok(user);
  }
}
