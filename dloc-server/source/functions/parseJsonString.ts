const parseJSONString = (jsonString: string): object => {
  try {
    const parsed = JSON.parse(jsonString);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch (e) {
    return {};
  }
};

export default parseJSONString;
