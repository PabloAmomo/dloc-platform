import { Position } from "../entities/Position";

export interface GetPositionsResult {
  results: Position[];
  error?: Error;  
}