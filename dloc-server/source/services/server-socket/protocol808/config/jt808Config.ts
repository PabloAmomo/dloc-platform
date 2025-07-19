import config from "../../../../config/config";
import Jt808ReportConfiguration from "../enums/Jt808reportConfiguration";

// Define the configuration for the JT808 protocol
const jt808Config: { REPORT_CONFIGURATION: Jt808ReportConfiguration;  } = {
  // Configuration for the report type used in the JT808 protocol)
  REPORT_CONFIGURATION: Jt808ReportConfiguration.intervalReport,
};

export default jt808Config;
