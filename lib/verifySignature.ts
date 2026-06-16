import { verifyMessage } from "viem";

const MAX_AGE_MS = 5 * 60 * 1000; // 5 хвилин

/**
 * Перевіряє що підпис належить вказаній адресі і timestamp свіжий.
 * message: `nexus-ai:auth:{address}:{timestamp}`
 */
export async function verifyWalletSignature(
  address: string,
  signature: string,
  timestamp: number
): Promise<boolean> {
  try {
    const age = Date.now() - timestamp;
    if (age < 0 || age > MAX_AGE_MS) return false;

    const message = `nexus-ai:auth:${address.toLowerCase()}:${timestamp}`;

    const valid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    });

    return valid;
  } catch {
    return false;
  }
}

// ── Simple in-memory rate limiter ────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Returns true if the IP is allowed, false if rate limited.
 * @param ip       Client IP string
 * @param limit    Max requests per window (default 20)
 * @param windowMs Window size in ms (default 60 000 = 1 min)
 */
export function checkRateLimit(
  ip: string,
  limit = 20,
  windowMs = 60_000
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}