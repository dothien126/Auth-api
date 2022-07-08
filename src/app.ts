require('dotenv').config();

import express from 'express';
import config from 'config';
import morgan from 'morgan'

import log from './utils/logger';
import connectToDb from './utils/connectDb';
import router from './routes';
import deserializeUser from './middleware/deserializeUser';

const app = express();

app.use(morgan('dev'))
app.use(express.json());
app.use(deserializeUser);
app.use(router);

const port = config.get('port');

app.listen(port, () => {
  log.info(`Server running on ${port}.`);

  connectToDb();
});
