function uniqueId(): string {
  return parseInt(String(Date.now()).slice(-6)).toString().padStart(6, "1").toString();
}

export { uniqueId };
