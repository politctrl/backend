import express, { Express } from 'express';
import { useExpressServer, Action } from 'routing-controllers';
import cors from 'cors';
import {
  AccountController,
  AccountOwnerController,
  GroupController,
  PostController,
} from './controllers';
import log from 'consola';
import { Server } from 'http';

export class WebServer {
  express: Express;
  server: Server;

  start() {
    this.express = express();
    this.express.use(cors());
    useExpressServer(this.express, {
      controllers: [
        AccountController,
        AccountOwnerController,
        PostController,
        GroupController,
      ],
      routePrefix: '/v1',
      authorizationChecker: async (action: Action) =>
        action.request.headers['authorization'] === process.env.AUTHORIZATION_STRING,
    });
    this.server = new Server(this.express);
    this.server.listen(parseInt(process.env.HTTP_PORT || '1447', 10), () => {
      log.success('API server running successfully');
    });
  }

  stop() {
    this.server.close(() => log.success('API server stopped successfully'));
  }
}
