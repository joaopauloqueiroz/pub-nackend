import "reflect-metadata";
import { container } from "tsyringe";
import { App, IAppFactory } from "./lib/app";
async function startServer(): Promise<void> {
  const appInstance = container.resolve<IAppFactory>(App);
  const port = process.env.APP_PORT || "3000";

  const serverInstance = await appInstance.build();
  await serverInstance.listen(port);
}

startServer();
