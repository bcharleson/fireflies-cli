import type { z } from 'zod';
import type { CommandDefinition } from './types.js';
import { resolveApiKey } from './auth.js';
import { createClient } from './client.js';
import { formatError } from './errors.js';
import { printOutput, printError, type OutputOptions } from './output.js';

export async function executeCommand<T extends z.ZodObject<z.ZodRawShape>>(
  def: CommandDefinition<T>,
  input: z.infer<T>,
  opts: OutputOptions & { apiKey?: string } = {},
): Promise<void> {
  try {
    const { apiKey } = await resolveApiKey(opts.apiKey);
    const client = createClient(apiKey);
    const result = await def.handler(input, client);
    printOutput(result, opts);
  } catch (err) {
    printError(formatError(err));
    process.exit(1);
  }
}
