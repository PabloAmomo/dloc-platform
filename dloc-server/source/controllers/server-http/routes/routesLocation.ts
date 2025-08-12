import { getPersistence } from '../../../persistence/persistence';
import { PositionPacket } from '../../../models/PositionPacket';
import express from 'express';
import { protoHttpHandlePacket } from '../../../services/server-http/protoHttpHandlePacket';
import config from '../../../config/config';

const routesLocation = express.Router();

const handlePacket = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const imei: string = req.query?.id?.toString() ?? req.query?.imei?.toString() ?? '';
  let lat: number = parseFloat(req.query?.lat?.toString() ?? config.INVALID_POSITION_LAT_LNG.toString()) ?? NaN;
  let lng: number = parseFloat(req.query?.lon?.toString() ?? req.query?.lng?.toString() ?? config.INVALID_POSITION_LAT_LNG.toString()) ?? NaN;
  const timestamp: string = req.query?.timestamp?.toString() ?? '';
  const speedValue: string = req.query?.speed?.toString() ?? '0';
  const bearing: string = req.query?.bearing?.toString() ?? '';
  const accuracy: number = parseInt(req.query?.accuracy?.toString() ?? '0') ?? 0;
  const activity: string = req.query?.activity?.toString() ?? '{}';
  const batt: string = req.query?.batt?.toString() ?? '';
  const dateTimeUtc: Date | null = timestamp ? new Date(parseInt(timestamp) * 1000) : new Date();
  const remoteAddress: string = req.ip?.toString() ?? '';
  const gsmSignal: number = 100;
  const valid: boolean = true;
  const batteryLevel: number = batt ? parseFloat(batt) : -1;
  const directionAngle: number = bearing ? parseFloat(bearing) : 0;

  let error: string = '';
  if (!imei) error = 'imei is required';
  else if (dateTimeUtc === null) error = 'invalid timestamp';

  /** Check if lat and lng are valid numbers */
  if (!isNaN(lat) && !isNaN(lng)) {
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) error = 'invalid latitude or longitude';
  } else {
    lat = config.INVALID_POSITION_LAT_LNG;
    lng = config.INVALID_POSITION_LAT_LNG;
  }

  /** Return error */
  if (error !== '') return res.status(400).json({ error });

  let speed: number = Number.isNaN(speedValue) ? parseFloat(speedValue) : 0;

  const positionPacket: PositionPacket = { imei, remoteAddress, dateTimeUtc, valid, lat, lng, gsmSignal, speed, directionAngle, batteryLevel, accuracy, activity };

  protoHttpHandlePacket(getPersistence(), positionPacket).then((response) => res.status(response.code).json(response.result));
};

routesLocation.post('/location', handlePacket);
routesLocation.get('/location', handlePacket);

export default routesLocation;
