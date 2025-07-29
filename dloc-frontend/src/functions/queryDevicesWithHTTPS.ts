import { configApp } from 'config/configApp';
import { Dispatch } from 'react';
import { GetPositionsResult } from 'models/GetPositionsResult';
import { User } from 'models/User';
import getPositionsWorker from 'webWorkers/getPositionsWorker/getPositionsWorker';
import WebWorker from './WebWorker';

const queryWorkerWithHTTPS = ({ worker, setWorker, minutes, user, processResponse }: QueryWorkerWithHTTPProps) => {
  let webWorker: any;
  if (!worker) {
    // Create a new worker
    webWorker = new WebWorker(getPositionsWorker);

    // Listen for messages from the worker
    webWorker.addEventListener('message', (event: { data: GetPositionsResult }) => processResponse(event.data));

    // Save the worker instance to state
    setWorker(webWorker);
  }
  (webWorker || worker).postMessage({ interval: minutes, user, path: configApp.apiUrl });
};

export { queryWorkerWithHTTPS };

interface QueryWorkerWithHTTPProps {
  worker: any;
  setWorker: Dispatch<any>;
  minutes: number;
  user: User;
  processResponse: { (data: GetPositionsResult): void };
}
