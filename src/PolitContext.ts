import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import { createExpressServer } from 'routing-controllers';
import PolitServiceManager from './PolitServiceManager';
import { AccountController, PostController, GroupController } from './controllers';
import { Post } from './entities/Post';
import { Account } from './entities/Account';
import { AccountOwner } from './entities/AccountOwner';
import { Group } from './entities/Group';
import { Embed } from './entities/Embed';
import { Application } from 'express';
import http from 'http';

export class PolitContext {
  connection: Connection;
  serviceManager: PolitServiceManager;
  apiApplication: Application;
  apiServer: http.Server;
  account: AccountController;
  post: PostController;
  group: GroupController;

  async initialize() {
    this.connection = await createConnection({
      type: 'postgres',
      database: process.env.PGDATABASE,
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT || '5432', 10),
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      entities: [
        Embed,
        Post,
        Account,
        AccountOwner,
        Group,
      ],
      synchronize: true,
    });
    this.serviceManager = new PolitServiceManager(this);
    this.apiApplication = createExpressServer({
      controllers: [
        AccountController,
        PostController,
        GroupController,
      ],
      routePrefix: '/v1',
    }) as Application;
    this.apiServer = http.createServer(this.apiApplication);
    this.account = new AccountController();
    this.post = new PostController();
    this.group = new GroupController();
  }

  async startPolit() {
    await this.serviceManager.startServices();
    await this.apiServer.listen(parseInt(process.env.HTTP_PORT || '1447', 10));
  }

  async stopPolit() {
    await this.apiServer.close();
    await this.serviceManager.stopServices();
    await this.connection.close();
  }
}
