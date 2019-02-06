import dotenv from 'dotenv';
dotenv.config();

import { PolitContext } from './fetcher/PolitContext';
const context = new PolitContext();
context.initialize()
  .then(() => context.startPolit())
  .then(() => console.log('Running'));

// import './api';
