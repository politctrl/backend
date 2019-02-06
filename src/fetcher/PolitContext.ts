import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import PolitServiceManager from './PolitServiceManager';
import { PolitPostListenerApi } from './PolitPostListenerApi';
import { Post } from './entities/Post';
import { User } from './entities/User';
import { Group } from './entities/Group';

export class PolitContext {
  connection: Connection;
  serviceManager: PolitServiceManager;
  listenerApi: PolitPostListenerApi;

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
  }

  startPolit() {
    this.serviceManager.startServices();
  }
}
