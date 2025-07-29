import { GoogleGeoPositionRequest } from "../../models/GoogleGeoPositionRequest";
import { GoogleGeoPositionResponse } from "../../models/GoogleGeoPositionResponse";

export type CacheLBS = {
  request: GoogleGeoPositionRequest;
  response: GoogleGeoPositionResponse;
}