const isValidDate = (date: Date) : boolean => {
  return date instanceof Date && !isNaN(date.getTime());
}

export { isValidDate }