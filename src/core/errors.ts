export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class GraphQLError extends Error {
  public readonly graphqlErrors: Array<{ message: string; locations?: unknown; path?: unknown }>;
  constructor(errors: Array<{ message: string }>) {
    const messages = errors.map((e) => e.message).join('; ');
    super(messages);
    this.name = 'GraphQLError';
    this.graphqlErrors = errors;
  }
}

export class RateLimitError extends Error {
  constructor(public retryAfter?: number) {
    super(
      retryAfter
        ? `Rate limited. Retry after ${retryAfter}s`
        : 'Rate limited. Please wait before retrying.',
    );
    this.name = 'RateLimitError';
  }
}

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ServerError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.name = 'ServerError';
  }
}

export function formatError(err: unknown): { error: string; code: string } {
  if (err instanceof AuthError) {
    return { error: err.message, code: 'AUTH_ERROR' };
  }
  if (err instanceof GraphQLError) {
    return { error: err.message, code: 'GRAPHQL_ERROR' };
  }
  if (err instanceof RateLimitError) {
    return { error: err.message, code: 'RATE_LIMIT' };
  }
  if (err instanceof NotFoundError) {
    return { error: err.message, code: 'NOT_FOUND' };
  }
  if (err instanceof ValidationError) {
    return { error: err.message, code: 'VALIDATION_ERROR' };
  }
  if (err instanceof ServerError) {
    return { error: err.message, code: 'SERVER_ERROR' };
  }
  return {
    error: err instanceof Error ? err.message : String(err),
    code: 'UNKNOWN_ERROR',
  };
}
