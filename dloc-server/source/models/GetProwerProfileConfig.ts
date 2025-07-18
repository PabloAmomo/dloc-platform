import { PowerProfileConfig } from './PowerProfileConfig';
import { PowerProfileType } from "../enums/PowerProfileType"

type GetPowerProfileConfig = (
  profileType: PowerProfileType 
) => PowerProfileConfig

export default GetPowerProfileConfig;