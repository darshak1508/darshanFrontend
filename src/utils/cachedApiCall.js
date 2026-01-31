/**
 * Cached API Call Wrapper
 * 
 * Enhanced version of apiCall that includes caching support.
 * Use this for GET requests that don't change frequently.
 */

import { apiCall } from './auth';
import { getFromCache, saveToCache, invalidateCache, invalidateCachePattern } from './cache';

/**
 * Cached API Call with automatic caching for GET requests
 * 
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @param {object} cacheOptions - Cache-specific options
 * @param {boolean} cacheOptions.useCache - Enable/disable cache (default: true for GET)
 * @param {boolean} cacheOptions.forceRefresh - Bypass cache and fetch fresh data
 * @returns {Promise<Response>} - Fetch Response object
 */
export async function cachedApiCall(endpoint, options = {}, cacheOptions = {}) {
  const method = options.method || 'GET';
  const isReadRequest = method === 'GET';

  // Cache options
  const {
    useCache = isReadRequest, // Only cache GET requests by default
    forceRefresh = false,      // Force fresh data
  } = cacheOptions;

  // Try to get from cache if it's a cacheable request
  if (useCache && !forceRefresh) {
    const cachedData = getFromCache(endpoint, options);
    if (cachedData !== null) {
      // Return cached response as a mock Response object
      return createMockResponse(cachedData);
    }
  }

  // Make actual API call
  const response = await apiCall(endpoint, options);

  // Cache successful GET responses
  if (useCache && response.ok && isReadRequest) {
    try {
      // Clone response to avoid consuming it
      const clonedResponse = response.clone();
      const data = await clonedResponse.json();
      saveToCache(endpoint, options, data);
    } catch (error) {
      console.warn('[Cached API] Failed to cache response:', error);
    }
  }

  // For write operations (POST, PUT, DELETE), invalidate related caches
  if (!isReadRequest && response.ok) {
    invalidateRelatedCaches(endpoint, method);
  }

  return response;
}

/**
 * Create a mock Response object from cached data
 */
function createMockResponse(data) {
  return {
    ok: true,
    status: 200,
    statusText: 'OK (Cached)',
    headers: new Headers(),
    json: async () => data,
    text: async () => JSON.stringify(data),
    clone: function () { return this; },
    _fromCache: true, // Mark as cached response
  };
}

/**
 * Invalidate related caches after write operations
 */
function invalidateRelatedCaches(endpoint, method) {
  console.log(`[Cache Invalidation] ${method} ${endpoint}`);

  // Extract resource type from endpoint
  // Example: /api/vehicle/123 -> vehicle
  const resourceMatch = endpoint.match(/(?:\/api)?\/([^\/]+)/);
  if (!resourceMatch) return;

  const resource = resourceMatch[1];

  // Invalidate caches based on the resource
  switch (resource) {
    case 'firm':
      invalidateCachePattern('/firm');
      invalidateCachePattern('/vehicle'); // Vehicles depend on firms
      invalidateCachePattern('/pricing'); // Pricing depends on firms
      invalidateCachePattern('/dashboard'); // Dashboard shows firms
      break;

    case 'vehicle':
      invalidateCachePattern('/vehicle');
      invalidateCachePattern('/dashboard'); // Dashboard shows vehicles
      break;

    case 'pricing':
      invalidateCachePattern('/pricing');
      invalidateCachePattern('/dashboard'); // Dashboard may show pricing
      break;

    case 'transaction':
      invalidateCachePattern('/transaction');
      invalidateCachePattern('/dashboard'); // Dashboard shows transactions
      break;

    default:
      // Invalidate the specific endpoint cache
      invalidateCache(endpoint, { method: 'GET' });
  }
}

/**
 * Prefetch data and store in cache
 * Useful for preloading data you know will be needed
 */
export async function prefetchData(endpoint, options = {}) {
  try {
    console.log(`[Prefetch] ${endpoint}`);
    await cachedApiCall(endpoint, options, { forceRefresh: true });
  } catch (error) {
    console.warn(`[Prefetch] Failed for ${endpoint}:`, error);
  }
}

/**
 * Batch prefetch multiple endpoints
 */
export async function prefetchBatch(endpoints) {
  const promises = endpoints.map(({ endpoint, options }) =>
    prefetchData(endpoint, options)
  );

  try {
    await Promise.all(promises);
    console.log(`[Prefetch] Batch completed: ${endpoints.length} endpoints`);
  } catch (error) {
    console.warn('[Prefetch] Batch failed:', error);
  }
}

export default cachedApiCall;
