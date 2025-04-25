import express from 'express';

const routesHealth = express.Router();

routesHealth.get('/health', (req, res, next) => res.status(200).json({ message: 'ok' }));

export default routesHealth;
