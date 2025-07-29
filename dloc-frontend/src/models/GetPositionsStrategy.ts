import { GetPositionsResult } from "./GetPositionsResult";

export interface GetPositionsStrategy {
  ({ getPositions, setLastUpdate, processResponse, setRunDataAdquistion }: GetPositionsStrategyProps): GetPositionsStrategy;
}

export interface GetPositionsStrategyProps {
  getPositions: { (): void };
  setLastUpdate: { (): void };
  processResponse: { (response: GetPositionsResult): void };
  setRunDataAdquistion: { (dataAdquistionFunction: { (): void }): void };
}
