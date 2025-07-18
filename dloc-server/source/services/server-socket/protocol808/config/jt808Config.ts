import config from "../../../../config/config";
import Jt808ReportConfiguration from "../enums/Jt808reportConfiguration";

// Define the configuration for the JT808 protocol
const jt808Config: { REPORT_CONFIGURATION: Jt808ReportConfiguration; REFRESH_POWER_PROFILE_EXTEND_SECONDS: number } = {
  REPORT_CONFIGURATION: Jt808ReportConfiguration.temporaryTracking,
  // Duration of the time during which the position will be sent from the device. This value is used to configure the active tracking duration period.
  REFRESH_POWER_PROFILE_EXTEND_SECONDS: config.MOVEMENTS_CONTROL_SECONDS * 2, // Double the time to ensure the profile is refreshed
};

export default jt808Config;
