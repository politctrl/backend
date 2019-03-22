import { PolitContext } from '../PolitContext';
import { Account } from '../entities/Account';
import { RxEvent } from '../utils/rxjsEvent';

export enum PolitPostListenerState {
  READY = 'ready',
  STARTING = 'starting',
  RUNNING = 'running',
  RESTARTING = 'restarting',
  STOPPING = 'stopping',
  STOPPED = 'stopped',
  BROKEN = 'broken',
}

export interface PolitPostListenerConstructor {
  listener: (ev: RxEvent<any>) => void;
  fetchedAccounts: Account[];
}

export interface PolitPostListenerBaseInterface {
  state: PolitPostListenerState;
  serviceName: string;
  fetchedAccounts: Account[];
  start: () => void;
  stop: () => void;
}

export class PolitPostListenerBase implements PolitPostListenerBaseInterface {
  context: PolitContext;
  state: PolitPostListenerState;
  serviceName: string;
  fetchedAccounts: Account[];
  listener: (ev: RxEvent<any>) => void;

  constructor(d: PolitPostListenerConstructor) {
    this.fetchedAccounts = d.fetchedAccounts;
    this.listener = d.listener;
    this.state = PolitPostListenerState.READY;
    this.serviceName = 'base';
  }

  async start() {}

  async stop() {}
}
