import path from 'path';
import log from 'consola';
import { PolitContext } from './PolitContext';
import { PolitPostListenerBase, PolitPostListenerState } from './fetcher/PolitPostListenerBase';
import PolitServiceListener from './PolitServiceListener';
import { Account } from './entities/Account';

export default class PolitServiceManager {
  context: PolitContext;
  listener: PolitServiceListener;
  services: {
    [key: string]: PolitPostListenerBase;
  } = {};

  constructor(context: PolitContext) {
    this.context = context;
    this.listener = new PolitServiceListener();
  }

  async startService(service: string) {
    const { PostListener } = require(path.join(__dirname, 'fetcher', 'services', service, 'index'));
    this.services[service] = new PostListener({
      listener: this.listener.getListener(),
      fetchedAccounts: await this.context.connection
        .getRepository(Account)
        .find({ service }),
    }) as PolitPostListenerBase;
    await this.services[service].start();
    if (this.services[service].state === PolitPostListenerState.RUNNING) {
      log.success(`Service ${service} running successfully`);
    } else {
      log.error(`Service ${service} didn't start (current state: ${this.services[service].state})`);
    }
  }

  async startServices() {
    if (!process.env.SERVICES_ON) {
      throw new Error('Turned on services not specified');
    }
    process.env.SERVICES_ON.split(',')
      .filter(ser => ser && ser.trim())
      .forEach(ser => this.startService(ser));
  }

  async stopService(service: string) {
    if (this.services[service]
      && this.services[service].state === PolitPostListenerState.RUNNING) {
      this.services[service].stop();
      log.info(`Service ${service} stopped successfully`);
    }
  }

  async stopServices() {
    log.info('Stopping all services');
    Object.values(this.services).forEach(ser => ser.stop()
      && log.info(`Service ${ser.serviceName} stopped successfully`));
  }
}
