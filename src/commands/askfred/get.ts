import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const ASKFRED_THREAD_QUERY = `
  query AskFredThread($id: String!) {
    askfred_thread(id: $id) {
      id
      transcript_id
      created_at
      messages {
        role
        content
      }
    }
  }
`;

export const askfredGetCommand: CommandDefinition = {
  name: 'askfred_get',
  group: 'askfred',
  subcommand: 'get',
  description: 'Get a single AskFred AI conversation thread with full message history',
  examples: ['fireflies askfred get thread123', 'fireflies askfred get thread123 --pretty'],
  inputSchema: z.object({
    id: z.string().min(1),
  }),
  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true, description: 'Thread ID' }],
  },
  handler: async (input, client) => {
    const data = await client.query<{ askfred_thread: unknown }>(ASKFRED_THREAD_QUERY, {
      id: input.id,
    });
    return data.askfred_thread;
  },
};
