/**
 * Cache Event System
 * 
 * Provides a publish-subscribe mechanism for cache invalidation events.
 * Components can subscribe to cache changes and react accordingly.
 */

const cacheEventListeners = new Map();

/**
 * Cache event types
 */
export const CacheEvents = {
  TRANSACTION_CREATED: 'transaction:created',
  TRANSACTION_UPDATED: 'transaction:updated',
  TRANSACTION_DELETED: 'transaction:deleted',
  FIRM_CREATED: 'firm:created',
  FIRM_UPDATED: 'firm:updated',
  FIRM_DELETED: 'firm:deleted',
  VEHICLE_CREATED: 'vehicle:created',
  VEHICLE_UPDATED: 'vehicle:updated',
  VEHICLE_DELETED: 'vehicle:deleted',
  PRICING_CREATED: 'pricing:created',
  PRICING_UPDATED: 'pricing:updated',
  PRICING_DELETED: 'pricing:deleted',
  CACHE_INVALIDATED: 'cache:invalidated',
};

/**
 * Subscribe to cache events
 * @param {string} eventType - Event type from CacheEvents
 * @param {Function} callback - Callback function to execute
 * @returns {Function} Unsubscribe function
 */
export function subscribeToCacheEvent(eventType, callback) {
  if (!cacheEventListeners.has(eventType)) {
    cacheEventListeners.set(eventType, new Set());
  }
  
  const listeners = cacheEventListeners.get(eventType);
  listeners.add(callback);
  
  // Return unsubscribe function
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0) {
      cacheEventListeners.delete(eventType);
    }
  };
}

/**
 * Publish a cache event
 * @param {string} eventType - Event type from CacheEvents
 * @param {any} data - Event data
 */
export function publishCacheEvent(eventType, data = null) {
  console.log(`[Cache Event] ${eventType}`, data);
  
  const listeners = cacheEventListeners.get(eventType);
  if (listeners) {
    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`[Cache Event] Error in listener for ${eventType}:`, error);
      }
    });
  }
  
  // Also trigger the generic cache invalidated event
  if (eventType !== CacheEvents.CACHE_INVALIDATED) {
    const genericListeners = cacheEventListeners.get(CacheEvents.CACHE_INVALIDATED);
    if (genericListeners) {
      genericListeners.forEach(callback => {
        try {
          callback({ eventType, data });
        } catch (error) {
          console.error(`[Cache Event] Error in generic listener:`, error);
        }
      });
    }
  }
}

/**
 * React hook for subscribing to cache events
 * @param {string} eventType - Event type from CacheEvents
 * @param {Function} callback - Callback function
 */
export function useCacheEvent(eventType, callback) {
  if (typeof window !== 'undefined' && window.React) {
    const { useEffect } = window.React;
    
    useEffect(() => {
      return subscribeToCacheEvent(eventType, callback);
    }, [eventType, callback]);
  }
}

export default {
  CacheEvents,
  subscribeToCacheEvent,
  publishCacheEvent,
  useCacheEvent,
};
