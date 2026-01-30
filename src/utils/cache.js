/**
 * Frontend API Cache Utility
 * 
 * Caches API responses in localStorage or memory to improve performance
 * when backend API calls are slow.
 * 
 * Features:
 * - Configurable cache duration per endpoint
 * - Memory cache (faster) and localStorage (persistent)
 * - Automatic cache invalidation
 * - Cache key generation
 */

// Cache configuration
const CACHE_CONFIG = {
  // Default cache duration: 5 minutes
  DEFAULT_TTL: 5 * 60 * 1000,
  
  // Specific endpoint cache durations (in milliseconds)
  ENDPOINTS: {
    '/api/firm': 10 * 60 * 1000,           // 10 minutes - firms change rarely
    '/api/vehicle': 5 * 60 * 1000,         // 5 minutes - vehicles
    '/api/pricing': 10 * 60 * 1000,        // 10 minutes - pricing rarely changes
    '/api/transaction/all': 2 * 60 * 1000, // 2 minutes - transactions change often
    '/api/dashboard': 1 * 60 * 1000,       // 1 minute - dashboard needs fresh data
  },
  
  // Use memory cache (faster) or localStorage (persistent across page reloads)
  USE_MEMORY: true,
  USE_LOCALSTORAGE: false,
};

// In-memory cache store
const memoryCache = new Map();

// Generate cache key from endpoint and options
function generateCacheKey(endpoint, options = {}) {
  const method = options.method || 'GET';
  const body = options.body || '';
  return `cache_${method}_${endpoint}_${body}`;
}

// Get cache TTL for specific endpoint
function getCacheTTL(endpoint) {
  // Check if specific endpoint has configured TTL
  for (const [pattern, ttl] of Object.entries(CACHE_CONFIG.ENDPOINTS)) {
    if (endpoint.includes(pattern)) {
      return ttl;
    }
  }
  return CACHE_CONFIG.DEFAULT_TTL;
}

/**
 * Get data from cache
 */
export function getFromCache(endpoint, options = {}) {
  const cacheKey = generateCacheKey(endpoint, options);
  
  // Try memory cache first
  if (CACHE_CONFIG.USE_MEMORY && memoryCache.has(cacheKey)) {
    const cached = memoryCache.get(cacheKey);
    
    // Check if cache is still valid
    if (Date.now() < cached.expiresAt) {
      console.log(`[Cache HIT] Memory: ${endpoint}`);
      return cached.data;
    } else {
      // Cache expired - remove it
      memoryCache.delete(cacheKey);
      console.log(`[Cache EXPIRED] Memory: ${endpoint}`);
    }
  }
  
  // Try localStorage cache
  if (CACHE_CONFIG.USE_LOCALSTORAGE) {
    try {
      const cachedStr = localStorage.getItem(cacheKey);
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        
        // Check if cache is still valid
        if (Date.now() < cached.expiresAt) {
          console.log(`[Cache HIT] LocalStorage: ${endpoint}`);
          
          // Also store in memory for faster access next time
          if (CACHE_CONFIG.USE_MEMORY) {
            memoryCache.set(cacheKey, cached);
          }
          
          return cached.data;
        } else {
          // Cache expired - remove it
          localStorage.removeItem(cacheKey);
          console.log(`[Cache EXPIRED] LocalStorage: ${endpoint}`);
        }
      }
    } catch (error) {
      console.warn('[Cache] Error reading from localStorage:', error);
    }
  }
  
  console.log(`[Cache MISS] ${endpoint}`);
  return null;
}

/**
 * Save data to cache
 */
export function saveToCache(endpoint, options = {}, data) {
  const cacheKey = generateCacheKey(endpoint, options);
  const ttl = getCacheTTL(endpoint);
  const expiresAt = Date.now() + ttl;
  
  const cacheData = {
    data,
    expiresAt,
    cachedAt: Date.now(),
  };
  
  // Save to memory cache
  if (CACHE_CONFIG.USE_MEMORY) {
    memoryCache.set(cacheKey, cacheData);
    console.log(`[Cache SAVE] Memory: ${endpoint} (TTL: ${ttl / 1000}s)`);
  }
  
  // Save to localStorage cache
  if (CACHE_CONFIG.USE_LOCALSTORAGE) {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      console.log(`[Cache SAVE] LocalStorage: ${endpoint} (TTL: ${ttl / 1000}s)`);
    } catch (error) {
      console.warn('[Cache] Error writing to localStorage:', error);
      // localStorage might be full - try to clear old cache
      clearExpiredCache();
    }
  }
}

/**
 * Invalidate specific endpoint cache
 */
export function invalidateCache(endpoint, options = {}) {
  const cacheKey = generateCacheKey(endpoint, options);
  
  // Remove from memory cache
  if (memoryCache.has(cacheKey)) {
    memoryCache.delete(cacheKey);
    console.log(`[Cache INVALIDATE] Memory: ${endpoint}`);
  }
  
  // Remove from localStorage
  if (CACHE_CONFIG.USE_LOCALSTORAGE) {
    localStorage.removeItem(cacheKey);
    console.log(`[Cache INVALIDATE] LocalStorage: ${endpoint}`);
  }
}

/**
 * Invalidate all caches matching a pattern
 * Example: invalidateCachePattern('/api/vehicle') will clear all vehicle-related caches
 */
export function invalidateCachePattern(pattern) {
  // Clear from memory cache
  for (const key of memoryCache.keys()) {
    if (key.includes(pattern)) {
      memoryCache.delete(key);
      console.log(`[Cache INVALIDATE Pattern] Memory: ${key}`);
    }
  }
  
  // Clear from localStorage
  if (CACHE_CONFIG.USE_LOCALSTORAGE) {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_') && key.includes(pattern)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`[Cache INVALIDATE Pattern] LocalStorage: ${key}`);
    });
  }
}

/**
 * Clear all expired cache entries
 */
export function clearExpiredCache() {
  const now = Date.now();
  
  // Clear expired memory cache
  for (const [key, value] of memoryCache.entries()) {
    if (now >= value.expiresAt) {
      memoryCache.delete(key);
    }
  }
  
  // Clear expired localStorage cache
  if (CACHE_CONFIG.USE_LOCALSTORAGE) {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_')) {
        try {
          const cached = JSON.parse(localStorage.getItem(key));
          if (now >= cached.expiresAt) {
            keysToRemove.push(key);
          }
        } catch (error) {
          // Invalid cache entry - remove it
          keysToRemove.push(key);
        }
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log(`[Cache] Cleared ${keysToRemove.length} expired entries`);
  }
}

/**
 * Clear ALL cache
 */
export function clearAllCache() {
  // Clear memory cache
  memoryCache.clear();
  console.log('[Cache] Cleared all memory cache');
  
  // Clear localStorage cache
  if (CACHE_CONFIG.USE_LOCALSTORAGE) {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log(`[Cache] Cleared ${keysToRemove.length} localStorage entries`);
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const memoryCacheSize = memoryCache.size;
  let localStorageCacheSize = 0;
  
  if (CACHE_CONFIG.USE_LOCALSTORAGE) {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('cache_')) {
        localStorageCacheSize++;
      }
    }
  }
  
  return {
    memoryCache: {
      enabled: CACHE_CONFIG.USE_MEMORY,
      size: memoryCacheSize,
    },
    localStorage: {
      enabled: CACHE_CONFIG.USE_LOCALSTORAGE,
      size: localStorageCacheSize,
    },
    config: CACHE_CONFIG,
  };
}

/**
 * Update cache configuration
 */
export function updateCacheConfig(config) {
  Object.assign(CACHE_CONFIG, config);
  console.log('[Cache] Configuration updated:', CACHE_CONFIG);
}

// Clean up expired cache every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    clearExpiredCache();
  }, 5 * 60 * 1000);
}

export default {
  get: getFromCache,
  save: saveToCache,
  invalidate: invalidateCache,
  invalidatePattern: invalidateCachePattern,
  clearExpired: clearExpiredCache,
  clearAll: clearAllCache,
  getStats: getCacheStats,
  updateConfig: updateCacheConfig,
};
