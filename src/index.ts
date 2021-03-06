import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
dotenvExpand(dotenv.config());

import log from 'consola';

import { PolitContext } from './PolitContext';
const context = new PolitContext();
context.initialize()
  .then(() => context.startPolit())
  .then(() => log.info('Starting PolitCtrl'))
  .then(() => process.on('SIGINT', () => {
    log.info('Shutting down PolitCtrl (SIGINT)');
    context.stopPolit();
  }));
