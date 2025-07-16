import { Persistence } from "../models/Persistence";
import distanceFromLatLngInMeters from "./distanceFromLatLngInMeters";

async function getMovementInLastSeconds(
  imei: string,
  timeInSec: number,
  persistence: Persistence,
  errorPrefix: string,
  movementType: "distance" | "perimeter"
): Promise<number> {
  let totalMovementInMts = 0;

  try {
    const response = await persistence.getLastPositions(imei, timeInSec);
    if (response.error) throw response.error;

    const positions = response.results;
    if (positions.length < 2) return totalMovementInMts;

    for (let i = 1; i < positions.length; i++) {
      const movementInMts = distanceFromLatLngInMeters(
        positions[movementType === "perimeter" ? 0 : i - 1].lat,
        positions[movementType === "perimeter" ? 0 : i - 1].lng,
        positions[i].lat,
        positions[i].lng
      );

      if (movementType === "perimeter" && movementInMts > totalMovementInMts)
        totalMovementInMts = movementInMts;

      if (movementType === "distance") totalMovementInMts += movementInMts;
    }
  } catch (error: any) {
    console.error(
      `${errorPrefix} ❌ error getting movement in last ${timeInSec} seconds [${
        error?.message ?? error
      }]`
    );
  }

  return totalMovementInMts;
}

export default getMovementInLastSeconds;
