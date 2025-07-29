import Jt808ReportConfiguration from "../enums/Jt808reportConfiguration";

const jt808Config: {
  REPORT_CONFIGURATION: Jt808ReportConfiguration;
  REQUEST_POSITION_ACTIVE_SECOND: number;
  REQUEST_POSITION_INTERVAL_SECOND: number;
} = {
  // TYPE OF REPORT CONFIGURATION
  REPORT_CONFIGURATION: Jt808ReportConfiguration.hybridRport,

  // TIME CONFIGURATION (FOR REQUEST FORCED REPORT)
  REQUEST_POSITION_ACTIVE_SECOND: 20,   // seconds
  REQUEST_POSITION_INTERVAL_SECOND: 40, // seconds
};

export default jt808Config;
