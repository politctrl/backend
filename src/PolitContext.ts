import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import { createExpressServer } from 'routing-controllers';
import PolitServiceManager from './PolitServiceManager';
import { PolitPostListenerApi } from './PolitPostListenerApi';
import { UserController, PostController } from './api';
import { Post } from './entities/Post';
import { User } from './entities/User';
import { Group } from './entities/Group';
import { GroupController } from './api/controllers/GroupController';

export class PolitContext {
  connection: Connection;
  serviceManager: PolitServiceManager;
  listenerApi: PolitPostListenerApi;
  apiServer: any;

  async initialize() {
    this.connection = await createConnection({
      type: 'postgres',
      database: process.env.PGDATABASE,
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT || '5432', 10),
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      entities: [
        Post,
        User,
        Group,
      ],
      synchronize: true,
    });
    this.serviceManager = new PolitServiceManager(this);
    this.listenerApi = new PolitPostListenerApi(this);
    this.apiServer = createExpressServer({
      controllers: [
        UserController,
        PostController,
        GroupController,
      ],
      routePrefix: '/v1',
    });
  }

  async startPolit() {
    await this.serviceManager.startServices();
    await this.apiServer.listen(parseInt(process.env.HTTP_PORT || '1447', 10));
  }
}
