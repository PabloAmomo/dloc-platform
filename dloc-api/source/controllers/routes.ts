import { Express } from 'express';
import { configDotenv } from 'dotenv';
import routesLogout from './logout';
import routesHealth from './health';
import routesDevices from './devices';
import routesEmail from './contact-us';
configDotenv();

const ROOT_PATH = process.env.ROOT_PATH ?? '';

const routes = (router: Express) => {
  router.use(`${ROOT_PATH}/`, routesDevices);
  router.use(`${ROOT_PATH}/`, routesEmail);
  router.use(`${ROOT_PATH}/`, routesHealth);
  router.use(`${ROOT_PATH}/`, routesLogout);
};

export default routes;
