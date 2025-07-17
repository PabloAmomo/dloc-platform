export type PowerProfileConfig = {
  heartBeatSec: number; // Heartbeat interval in seconds
  uploadSec: number; // Upload interval 
  ledState: boolean; // LED state
  forceReportLocInMs: number; // Force report location in milliseconds
  movementMeters: number; // Movement distance in meters
}