import dotenv from 'dotenv';
dotenv.config();

import { PolitContext } from './fetcher/PolitContext';
const context = new PolitContext();
context.startPolit();

// import './api';
