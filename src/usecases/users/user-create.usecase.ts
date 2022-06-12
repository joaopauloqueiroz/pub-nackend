import { ErrorCode } from "@consts/error";
import { Result } from "@core/result";
import { IUseCase } from "@core/usecase";
import { PrismaClient, User } from "@prisma/client";
import {
  GeneratePasswordUseCase,
  IGeneratePasswordUseCase,
} from "@usecases/secret/generate-password.usecase";
import {
  FindUserByEmail,
  IFindUserByEmail,
} from "@usecases/users/find-userby-email.usecase";
import { inject, singleton } from "tsyringe";

export interface IUserCreated extends Omit<User, "password"> {}

export type IUserUseCase = IUseCase<IUserCreateDTO, IUserCreated>;

export interface IUserCreateDTO {
  name: string;
  email: string;
  password: string;
}

@singleton<IUserUseCase>()
export class UserUseCase implements IUserUseCase {
  private readonly prismaClient: PrismaClient;
  constructor(
    @inject(FindUserByEmail) private findUserByEmail: IFindUserByEmail,
    @inject(GeneratePasswordUseCase)
    private generatePasswordUseCase: IGeneratePasswordUseCase
  ) {
    this.prismaClient = new PrismaClient();
  }

  async execute(userCreate: IUserCreateDTO): Promise<Result<IUserCreated>> {
    const user = await this.findUserByEmail.execute({
      email: userCreate.email,
    });

    if (!user.getValue()) {
      const passwordHash = this.generatePasswordUseCase.execute({
        password: userCreate.password,
      });

      const userCreated = await this.prismaClient.user.create({
        data: {
          ...userCreate,
          password: (await passwordHash).getValue() as string,
        },
      });
      return Result.ok(userCreated as IUserCreated);
    }
    return Result.fail(ErrorCode.USER_EMAIL_ALREADY_EXISTS);
  }
}
