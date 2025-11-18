// PokeAPI service with caching and error handling

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  data: any;
  timestamp: number;
}

class PokeAPIService {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;

  private getCacheKey(endpoint: string): string {
    return `pokeapi_${endpoint}`;
  }

  private getFromCache(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });

    // Also persist to localStorage for offline access
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Failed to persist cache to localStorage:', e);
    }
  }

  private async fetchWithRetry(url: string, retries = this.maxRetries): Promise<any> {
    try {
      const response = await fetch(url);
      
      if (response.status === 429) {
        // Rate limited
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          return this.fetchWithRetry(url, retries - 1);
        }
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      if (!response.ok) {
        throw new Error(`PokeAPI error: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.fetchWithRetry(url, retries - 1);
      }
      throw error;
    }
  }

  async fetchPokemon(nameOrId: string | number): Promise<any> {
    const endpoint = `pokemon/${nameOrId}`;
    const cacheKey = this.getCacheKey(endpoint);

    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      console.log(`Cache hit for ${endpoint}`);
      return cached;
    }

    // Check localStorage fallback
    try {
      const stored = localStorage.getItem(cacheKey);
      if (stored) {
        const entry = JSON.parse(stored);
        if (Date.now() - entry.timestamp < CACHE_TTL) {
          this.cache.set(cacheKey, entry);
          return entry.data;
        }
      }
    } catch (e) {
      console.warn('Failed to read from localStorage:', e);
    }

    // Fetch from API
    console.log(`Fetching ${endpoint} from PokeAPI`);
    const data = await this.fetchWithRetry(`${POKEAPI_BASE}/${endpoint}`);
    this.setCache(cacheKey, data);
    return data;
  }

  async fetchMove(nameOrId: string | number): Promise<any> {
    const endpoint = `move/${nameOrId}`;
    const cacheKey = this.getCacheKey(endpoint);

    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const data = await this.fetchWithRetry(`${POKEAPI_BASE}/${endpoint}`);
    this.setCache(cacheKey, data);
    return data;
  }

  async fetchType(nameOrId: string | number): Promise<any> {
    const endpoint = `type/${nameOrId}`;
    const cacheKey = this.getCacheKey(endpoint);

    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const data = await this.fetchWithRetry(`${POKEAPI_BASE}/${endpoint}`);
    this.setCache(cacheKey, data);
    return data;
  }

  async fetchRandomPokemon(): Promise<any> {
    // Gen 1-2 Pokémon (1-251)
    const randomId = Math.floor(Math.random() * 251) + 1;
    return this.fetchPokemon(randomId);
  }

  clearCache(): void {
    this.cache.clear();
    // Clear localStorage cache
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('pokeapi_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn('Failed to clear localStorage cache:', e);
    }
  }
}

export const pokeApi = new PokeAPIService();
