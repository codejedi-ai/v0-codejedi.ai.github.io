/**
 * Backend Configuration
 * Contains configuration variables for backend services
 */

// Cache configuration - uses environment variable with fallback to false (caching enabled by default)
export const DISABLE_CACHE = process.env.DISABLE_CACHE === 'true';

// Alternative configuration object approach
export const BACKEND_CONFIG = {
  cache: {
    enabled: !DISABLE_CACHE, // Invert the disable flag to get enable flag
    ttl: parseInt(process.env.CACHE_TTL || '3600', 10), // Time to live in seconds, default: 1 hour
  },
  // Other backend configurations can be added here
} as const;