import { Persistence } from "../models/Persistence";
import distanceFromLatLngInMeters from "./distanceFromLatLngInMeters";

async function getMovementInLastSeconds(
  imei: string,
  timeInSec: number,
  persistence: Persistence,
  errorPrefix: string
): Promise<number> {
  let movementInMts = 0;

  try {
    const response = await persistence.getLastPositions(imei, timeInSec);
    if (response.error) throw response.error;

    const positions = response.results;
    if (positions.length < 2) return movementInMts;

    for (let i = 1; i < positions.length; i++) {
      movementInMts += distanceFromLatLngInMeters(positions[i - 1].lat, positions[i - 1].lng, positions[i].lat, positions[i].lng);
    }
  } catch (error: any) {
    console.error(
      `${errorPrefix} ❌ error getting movement in last ${timeInSec} seconds [${
        error?.message ?? error
      }]`
    );
  }

  return movementInMts
}

export default getMovementInLastSeconds;