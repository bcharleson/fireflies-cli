import { AuthError, GraphQLError, RateLimitError, ServerError } from './errors.js';

const GQL_ENDPOINT = 'https://api.fireflies.ai/graphql';

export interface FirefliesClient {
  query<T>(query: string, variables?: Record<string, unknown>): Promise<T>;
  mutate<T>(mutation: string, variables?: Record<string, unknown>): Promise<T>;
}

export function createClient(apiKey: string): FirefliesClient {
  async function send<T>(doc: string, variables?: Record<string, unknown>): Promise<T> {
    const res = await fetch(GQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query: doc, variables }),
    });

    if (res.status === 401) {
      throw new AuthError('Invalid API key. Run: fireflies login');
    }
    if (res.status === 429) {
      const parsedRetryAfter = Number(res.headers.get('Retry-After'));
      throw new RateLimitError(
        Number.isFinite(parsedRetryAfter) && parsedRetryAfter > 0 ? parsedRetryAfter : undefined,
      );
    }
    if (!res.ok) {
      throw new ServerError(`HTTP ${res.status}: ${res.statusText}`, res.status);
    }

    let json: { data?: T; errors?: Array<{ message: string }> };
    try {
      json = (await res.json()) as typeof json;
    } catch {
      throw new ServerError('Invalid JSON response from Fireflies API');
    }

    if (json.errors?.length) {
      throw new GraphQLError(json.errors);
    }

    if (json.data == null) {
      throw new GraphQLError([{ message: 'Fireflies API returned no data' }]);
    }

    return json.data;
  }

  return {
    query: send,
    mutate: send,
  };
}
