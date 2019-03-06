import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import PolitServiceManager from './PolitServiceManager';
import { AccountController, PostController, GroupController } from './controllers';
import { Post } from './entities/Post';
import { Account } from './entities/Account';
import { AccountOwner } from './entities/AccountOwner';
import { Group } from './entities/Group';
import { Embed } from './entities/Embed';
import { WebServer } from './WebServer';

export class PolitContext {
  connection: Connection;
  serviceManager: PolitServiceManager;
  api: WebServer;
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
    this.api = new WebServer();
    this.account = new AccountController();
    this.post = new PostController();
    this.group = new GroupController();
  }

  async startPolit() {
    await this.serviceManager.startServices();
    await this.api.start();
  }

  async stopPolit() {
    await this.api.stop();
    await this.serviceManager.stopServices();
    await this.connection.close();
  }
}
