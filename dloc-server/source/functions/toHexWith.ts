const toHexWith = (value: number, length: number ): string => {
  return value.toString(16).toUpperCase().padStart(length, '0');
}

export default toHexWith;