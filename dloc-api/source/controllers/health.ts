import { getPersistence } from '../persistence/persistence';
import { persistenceHealth } from '../services/health/persistenceHealth';
import { ResponseCode } from '../enums/ResponseCode';
import express from 'express';

const routers = express.Router();

routers.get('/health', (req, res, next) => res.status(ResponseCode.OK).json({ message: 'ok' }));

routers.get('/persistenceHealth', (req, res, next) => persistenceHealth(getPersistence()).then((response) => res.status(response.code).json(response.result)));

export default routers;
