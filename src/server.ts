import "dotenv/config";
import grpc from "grpc";

const server = new grpc.Server();
server.bindAsync(
  `0.0.0.0:${process.env.APP_PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    server.start();
    console.log(`Server is runing => 0.0.0.0:${process.env.APP_PORT}`);
  }
);
