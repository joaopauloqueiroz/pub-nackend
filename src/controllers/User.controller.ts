import {
  AuthUserUseCase,
  IAuthUserUseCase,
  IUserAuthRequest,
} from "@usecases/users/user-auth.usecase";
import {
  IUserCreateDTO,
  IUserUseCase,
  UserUseCase,
} from "@usecases/users/user-create.usecase";
import { UserAuthSchema } from "@validations/users/user-auth.schema";
import { UserCreateSchema } from "@validations/users/user-create.schema";
import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, POST } from "fastify-decorators";
import { container } from "tsyringe";

@Controller("/users")
export default class UserController {
  private readonly userCreateUseCase: IUserUseCase;
  private readonly userAuth: IAuthUserUseCase;
  constructor() {
    this.userCreateUseCase = container.resolve<IUserUseCase>(UserUseCase);
    this.userAuth = container.resolve<IAuthUserUseCase>(AuthUserUseCase);
  }
  @POST("", { schema: { body: UserCreateSchema } })
  async handlerUser(req: FastifyRequest, res: FastifyReply) {
    const response = await this.userCreateUseCase.execute(
      req.body as IUserCreateDTO
    );
    response.send(201, res);
  }

  @POST("/auth", { schema: { body: UserAuthSchema } })
  async handlerUserAuth(req: FastifyRequest, res: FastifyReply) {
    const response = await this.userAuth.execute(req.body as IUserAuthRequest);
    return response.send(200, res);
  }

  @POST("/forget-password")
  async handleForgetPassword(req: FastifyRequest, res: FastifyReply) {
    const response = await this.userAuth.execute(req.body as IUserAuthRequest);
    return response.send(200, res);
  }
}
