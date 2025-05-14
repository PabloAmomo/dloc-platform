function powerProfileConfig(profileType: 'full' | 'balanced' |  'minimal' = 'full') {
  if (profileType === 'minimal') {
    return {
      heartBeatSec: "240",            // seconds
      uploadSec: "0180",              // seconds
      ledState: "0",                  // 0: off, 1: on
      forceReportLocInMs: 240 * 1000, // 0: off, 1000...720000: on [every milliseconds]
    };
  }

  if (profileType === 'balanced') {
    return {
      heartBeatSec: "180",            // seconds
      uploadSec: "060",               // seconds
      ledState: "0",                  // 0: off, 1: on
      forceReportLocInMs: 90 * 1000,  // 0: off, 1000...720000: on [every milliseconds]
    };
  }

  // Full power profile configuration
  return {
    heartBeatSec: "120",              // seconds
    uploadSec: "0020",                // seconds
    ledState: "1",                    // 0: off, 1: on
    forceReportLocInMs: 60 * 1000,    // 0: off, 1000...720000: on [every milliseconds]
  };
}

export default powerProfileConfig;
