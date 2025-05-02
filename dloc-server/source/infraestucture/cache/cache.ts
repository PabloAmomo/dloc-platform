type CacheEntry<T> = {
  value: T;
  expiry: number; // timestamp in milliseconds
};

export class Cache<T = any> {
  private store: Map<string, CacheEntry<T>> = new Map();
  private ttl: number; // in milliseconds

  constructor(ttlSeconds: number = 3600) {
    this.ttl = ttlSeconds * 1000; // Convert to milliseconds
  }

  set(key: string, value: T): void {
    const expiry = Date.now() + this.ttl;
    this.store.set(key, { value, expiry });
  }

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiry) {
      this.store.delete(key); // Remove expired entry
      return undefined;
    }

    return entry.value;
  }

  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry || Date.now() > entry.expiry) {
      this.store.delete(key);
      return false;
    }
    return true;
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}
