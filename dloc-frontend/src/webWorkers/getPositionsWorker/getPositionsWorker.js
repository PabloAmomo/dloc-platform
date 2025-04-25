/* eslint-disable no-restricted-globals */
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  self.addEventListener('message', (message) => {
    let user = message.data.user;
    let { authProvider } = user;
    let server = message.data.path;
    let interval = message.data.interval;

    /** Headers for the fetch request */
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
    };
    if (authProvider && authProvider !== 'none') headers['Auth-Provider'] = `${authProvider.toString()}`;

    /** Response data */
    const returnData = { positions: undefined, error: undefined };

    /** Fetch request to get the devices */
    fetch(`${server}/devices?interval=${interval}`, { method: 'GET', headers })
      /** Get the response */
      .then((response) => {
        /** Check if the response is ok */
        if (!response.ok) {
          returnData.error = { response: { status: response.status, message: response.statusText }, message: response.statusText };
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        /** Return the response in JSON format */
        return response.json();
      })
      /** Get the positions (Devices data) */
      .then((data) => {
        returnData.positions = data.data ?? [];
      })
      .catch((error) => console.error('Worker getPositionWorker has been a problem with your fetch operation:', error))
      /** Send the data back to the main thread */
      .finally(() => postMessage(returnData));
  });
};
