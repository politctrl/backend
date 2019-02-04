import PolitServiceManager from './PolitServiceManager';
import { Pool } from 'pg';
import { PolitPostListenerApi } from './PolitPostListenerApi';

export class PolitContext {
  serviceManager: PolitServiceManager;
  database: Pool;
  listenerApi: PolitPostListenerApi;

  constructor() {
    this.serviceManager = new PolitServiceManager(this);
    this.database = new Pool();
    this.listenerApi = new PolitPostListenerApi(this);

    // set up database tables
    this.database.query(`CREATE TABLE IF NOT EXISTS users (
      external_id VARCHAR(40),
      display_name VARCHAR(40) NOT NULL,
      active BOOLEAN NOT NULL,
      service VARCHAR(40) NOT NULL,
      groups INT[]
    );`);
    this.database.query(`CREATE TABLE IF NOT EXISTS groups (
      id VARCHAR(40) PRIMARY KEY,
      display_name VARCHAR(40) NOT NULL,
      master_groups INT[]
    );`);
    this.database.query(`CREATE TABLE IF NOT EXISTS posts (
      service VARCHAR(40) NOT NULL,
      external_id VARCHAR(40) NOT NULL,
      author VARCHAR(40) NOT NULL,
      content TEXT NOT NULL,
      create_timestamp BIGINT NOT NULL,
      embeds JSON,
      deleted BOOLEAN NOT NULL,
      delete_timestamp BIGINT
    );`);
  }

  startPolit() {
    this.serviceManager.startServices();
  }
}
