
import { Express } from 'express';
import { configDotenv } from 'dotenv';
import routesHealth from './routes/routesHealth';
import routesLocation from './routes/routesLocation';
configDotenv();

const ROOT_PATH = process.env.ROOT_PATH ?? '';

const routes = (router: Express) => {
  router.use(`${ROOT_PATH}/`, routesHealth);
  router.use(`${ROOT_PATH}/`, routesLocation);
}

export default routes;