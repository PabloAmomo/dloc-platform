import { configApp } from 'config/configApp';
import { GetPositionsStrategy, GetPositionsStrategyProps  } from 'models/GetPositionsStrategy';
import { queryWorkerWithHTTPS } from 'functions/queryDevicesWithHTTPS';
import { useEffect, useRef, useState } from 'react';
import { useMapContext } from 'providers/MapProvider';
import { useUserContext } from 'providers/UserProvider';

const useGetPositionsStrategyHTTPSHook: GetPositionsStrategy = (props: GetPositionsStrategyProps) => {
  const { processResponse, setRunDataAdquistion } = props;
  const [queryRequest, setQueryRequest] = useState<number>(0);
  const [worker, setWorker] = useState<any>();
  const { minutes } = useMapContext();
  const { user } = useUserContext();
  const timer = useRef<number>(0);

  /** Process new adquision request */
  useEffect(() => {
    if (queryRequest > 0) runDataQuery();
  }, [queryRequest]);

  /** Request the positions */
  const requestDataQuery = () => setQueryRequest((prev: number) => prev + 1);

  useEffect(() => {
    /** Set the function to run the data adquisition */
    setRunDataAdquistion(requestDataQuery);

    /** Get the initial position */
    requestDataQuery();

    /** Create a timer to get the positions */
    timer.current && clearInterval(timer.current);
    timer.current = setInterval(() => requestDataQuery(), configApp.retrievePositions);

    /** Clear the timer when the component unmounts */
    return () => {
      timer.current && clearInterval(timer.current);
      worker && worker.terminate();
    };
  }, []);

  // REQUEST THE POSITIONS -------------------------------------------------------------------------------------------------
  const runDataQuery = () => {
    queryWorkerWithHTTPS({ worker, setWorker, minutes, user, processResponse });
  };
  // REQUEST THE POSITIONS -------------------------------------------------------------------------------------------------

  /** Return the hook */
  return useGetPositionsStrategyHTTPSHook;
};

export { useGetPositionsStrategyHTTPSHook };
