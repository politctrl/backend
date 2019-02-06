import path from 'path';
import { PolitContext } from './PolitContext';
import { PolitPostListenerBase, PolitPostListenerState } from './PolitPostListenerBase';

export default class PolitServiceManager {
  context: PolitContext;
  services: {
    [key: string]: PolitPostListenerBase;
  } = {};

  constructor(context: PolitContext) {
    this.context = context;
  }

  async startService(service: string) {
    const { PostListener } = require(path.join(__dirname, 'services', service, 'index'));
    this.services[service] = new PostListener(this.context) as PolitPostListenerBase;
    await this.services[service].updateFetchedUsers();
    await this.services[service].start();
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
    }
  }

  async stopServices() {
    Object.values(this.services).forEach(ser => ser.stop());
  }
}