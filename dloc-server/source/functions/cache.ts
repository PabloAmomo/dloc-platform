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
    const expiry = this.ttl === 0 ? 0 : (Date.now() + this.ttl);
    this.store.set(key, { value, expiry });
  }

  get(key: string): T | undefined {
    const entry = this.store.get(key);

    if (!entry || this._isExpired(key)) return undefined; // Entry is expired or not found

    return entry.value;
  }

  has(key: string): boolean {
    return !this._isExpired(key);
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  _isExpired(key: string): boolean {
    const entry = this.store.get(key);
    
    if (!entry) return true;

    if (entry.expiry != 0 && Date.now() > entry.expiry) {
      this.delete(key); 
      return true;
    }

    return false;
  }
}
