const elimintateDuplicates = (arr: any[]) => {
  if (arr?.length == 1) return arr;

  const filterResult = [];

  for (let index = 0; index < arr.length; index++) {
    const elCurrent = arr[index];

    if (index === 0 || index === arr.length - 1) {
      filterResult.push(elCurrent);
      continue;
    }

    const elPrev = arr[index - 1];
    const elNext = arr[index + 1];

    if (elCurrent.lat !== elPrev.lat || elCurrent.lng !== elPrev.lng || elCurrent.lat !== elNext.lat || elCurrent.lng !== elNext.lng)
      filterResult.push(elCurrent);
  }

  return filterResult;
};

export { elimintateDuplicates };
