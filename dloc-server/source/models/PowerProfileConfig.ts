export type PowerProfileConfig = {
  heartBeatSec: number; // Heartbeat interval in seconds
  uploadSec: number; // Upload interval 
  ledState: boolean; // LED state
  forceReportLocInSec: number; // Force report location in seconds
  movementMeters: number; // Movement distance in meters
}