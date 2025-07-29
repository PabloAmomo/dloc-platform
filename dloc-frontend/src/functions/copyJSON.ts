function copyJSON<T>(object: T) : T {
  return JSON.parse(JSON.stringify(object));
}

export default copyJSON;