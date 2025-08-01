const isLocalIp = (ip: string): boolean => {
  return (ip.includes("127.0.0.1") || ip.includes("::1"));
}

export default isLocalIp;