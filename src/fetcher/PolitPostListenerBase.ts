import { PolitContext } from '../PolitContext';
import { Account } from '../entities/Account';

export enum PolitPostListenerState {
  READY = 'ready',
  STARTING = 'starting',
  RUNNING = 'running',
  RESTARTING = 'restarting',
  STOPPING = 'stopping',
  STOPPED = 'stopped',
  BROKEN = 'broken',
}

export interface PolitPostListenerBaseInterface {
  state: PolitPostListenerState;
  serviceName: string;
  fetchedAccounts: Account[];
  updateFetchedAccounts: () => void;
  start: () => void;
  stop: () => void;
}

export class PolitPostListenerBase implements PolitPostListenerBaseInterface {
  context: PolitContext;
  state: PolitPostListenerState;
  serviceName: string;
  fetchedAccounts: Account[];

  constructor(context: PolitContext) {
    this.context = context;
    this.fetchedAccounts = [];
    this.state = PolitPostListenerState.READY;
    this.serviceName = 'base';
  }

  async updateFetchedAccounts() {
    this.fetchedAccounts = await this.context.account.getAllByService(this.serviceName);
  }

  async start() {}

  async stop() {}
}
