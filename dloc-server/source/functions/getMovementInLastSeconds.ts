import { Persistence } from "../models/Persistence";

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

    console.log("--------------------------------------");
    console.log(positions);
    console.log("--------------------------------------");

    for (let i = 1; i < positions.length; i++) {
      const distance = Math.sqrt(
        Math.pow(positions[i].lat - positions[i - 1].lat, 2) +
          Math.pow(positions[i].lng - positions[i - 1].lng, 2)
      );
      movementInMts += distance;
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