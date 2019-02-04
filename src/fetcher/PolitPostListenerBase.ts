import { PolitContext } from './PolitContext';

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
  fetchedUsers: string[] | number[];
  updateFetchedUsers: () => void;
  start: () => void;
  stop: () => void;
}

export class PolitPostListenerBase implements PolitPostListenerBaseInterface {
  context: PolitContext;
  state: PolitPostListenerState;
  serviceName: string;
  fetchedUsers: string[] | number[];

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
