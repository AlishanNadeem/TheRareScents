// Minimal in-memory fixed-window rate limiter — good enough to blunt basic
// form-spam bots on a small single-instance deployment. It resets on cold
// start/restart and isn't shared across serverless instances; swap in a
// Redis/Upstash-backed limiter if this ever needs to scale.

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5; // per key, per window

const hits = global._rateLimitHits || new Map();
global._rateLimitHits = hits;

export function checkRateLimit(
  key,
  { windowMs = WINDOW_MS, max = MAX_REQUESTS } = {}
) {
  const now = Date.now();
  const timestamps = (hits.get(key) || []).filter((t) => now - t < windowMs);

  if (timestamps.length >= max) {
    hits.set(key, timestamps);
    return {
      allowed: false,
      retryAfterMs: windowMs - (now - timestamps[0]),
    };
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return { allowed: true };
}
