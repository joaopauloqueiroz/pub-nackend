import { ErrorCode } from "@consts/error";
import { Result } from "@core/result";
import { IUseCase } from "@core/usecase";
import { User } from "@prisma/client";
import {
  GeneratePasswordUseCase,
  IGeneratePasswordUseCase,
} from "@usecases/secret/generate-password.usecase";
import {
  GenerateTokenUseCase,
  IGenerateTokenUseCase,
} from "@usecases/secret/generate-token.usecase";
import {
  IValidatePasswordUseCase,
  ValidatePasswordUseCase,
} from "@usecases/secret/validate-password.usecase";
import {
  FindUserByEmail,
  IFindUserByEmail,
} from "@usecases/users/find-userby-email.usecase";
import { inject, singleton } from "tsyringe";

type IUserRequestTypes = "name" | "createdAt" | "updatedAt" | "id";

export interface IUserAuthRequest extends Omit<User, IUserRequestTypes> {}

export type IAuthUserUseCase = IUseCase<IUserAuthRequest, IUserGrantAccess>;

export interface IUserGrantAccess {
  accessToken: string;
  user: Omit<User, "password">;
}

@singleton<IAuthUserUseCase>()
export class AuthUserUseCase implements IAuthUserUseCase {
  constructor(
    @inject(FindUserByEmail) private findUserByEmail: IFindUserByEmail,
    @inject(GeneratePasswordUseCase)
    private generatePasswordUseCase: IGeneratePasswordUseCase,
    @inject(GenerateTokenUseCase)
    private generateTokenUseCase: IGenerateTokenUseCase,
    @inject(ValidatePasswordUseCase)
    private validatePasswordUser: IValidatePasswordUseCase
  ) {}

  async execute(data: IUserAuthRequest): Promise<Result<IUserGrantAccess>> {
    const user = (
      await this.findUserByEmail.execute({ email: data.email })
    ).getValue();
    if (!user) return Result.fail(ErrorCode.NOT_FOUND_USER_ERROR);
    const isAuthUser = await this.validatePasswordUser.execute({
      password: data.password,
      passwordHash: user.password,
    });

    if (!isAuthUser) return Result.fail(ErrorCode.UNAUTHORIZED_ERROR);
    const accessToken = (
      await this.generateTokenUseCase.execute(user)
    ).getValue() as string;
    const { name, id, email, createdAt, updatedAt } = user;
    return Result.ok({
      accessToken,
      user: { name, id, email, createdAt, updatedAt },
    });
  }
}
