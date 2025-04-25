const logError = (error: string, objError?: Error) => {
  console.log('[ERROR] --> ', error);
  if (objError) {
    console.log(objError);
  }
};

export { logError };
