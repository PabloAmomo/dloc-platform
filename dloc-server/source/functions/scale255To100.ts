const scale255to100 = (value: number): number => {
  return Math.round((value / 255) * 100);
};

export default scale255to100;