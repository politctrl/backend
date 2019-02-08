import dotenv from 'dotenv';
dotenv.config();

import log from 'consola';

import { PolitContext } from './PolitContext';
const context = new PolitContext();
context.initialize()
  .then(() => context.startPolit())
  .then(() => log.info('Starting PolitCtrl'));
