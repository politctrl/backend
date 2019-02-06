import { PolitContext } from '../PolitContext';
import { User } from '../entities/User';

export enum PolitPostListenerState {
  READY,
  STARTING,
  RUNNING,
  RESTARTING,
  STOPPING,
  STOPPED,
  BROKEN,
}

export interface PolitPostListenerBaseInterface {
  state: PolitPostListenerState;
  serviceName: string;
  fetchedUsers: User[];
  updateFetchedUsers: () => void;
  start: () => void;
  stop: () => void;
}

export class PolitPostListenerBase implements PolitPostListenerBaseInterface {
  context: PolitContext;
  state: PolitPostListenerState;
  serviceName: string;
  fetchedUsers: User[];

  constructor(context: PolitContext) {
    this.context = context;
    this.fetchedUsers = [];
    this.state = PolitPostListenerState.READY;
    this.serviceName = 'base';
  }

  async updateFetchedUsers() {
    this.fetchedUsers = await this.context.listenerApi.getFetchedUsers(this.serviceName);
  }

  async start() {}

  async stop() {}
}
