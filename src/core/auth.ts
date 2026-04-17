import { readConfig } from './config.js';
import { AuthError } from './errors.js';

export type AuthSource = 'flag' | 'env' | 'config';

export interface ResolvedAuth {
  apiKey: string;
  source: AuthSource;
}

/**
 * Resolve the Fireflies API key using 3-tier priority:
 * 1. --api-key CLI flag (flagValue)
 * 2. FIREFLIES_API_KEY environment variable
 * 3. ~/.fireflies-cli/config.json
 */
export async function resolveApiKey(flagValue?: string): Promise<ResolvedAuth> {
  if (flagValue) {
    return { apiKey: flagValue, source: 'flag' };
  }

  const envKey = process.env['FIREFLIES_API_KEY'];
  if (envKey) {
    return { apiKey: envKey, source: 'env' };
  }

  const config = await readConfig();
  if (config.apiKey) {
    return { apiKey: config.apiKey, source: 'config' };
  }

  throw new AuthError(
    'No API key found. Set FIREFLIES_API_KEY, use --api-key, or run: fireflies login',
  );
}
