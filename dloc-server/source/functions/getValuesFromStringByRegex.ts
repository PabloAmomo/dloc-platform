function getValuesFromStringByRegexs(
  data: string,
  regex: RegExp[]
): { values: string[]; regexIndex: number } {
  let values: string[] = [];
  let regexIndex = -1;

  for (let i = 0; i < regex.length; i++) {
    regexIndex = i;
    values = data.match(regex[i]) ?? [];
    if (values.length) break;
  }

  return { values, regexIndex };
}

export default getValuesFromStringByRegexs;
