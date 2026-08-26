import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const ASKFRED_THREADS_QUERY = `
  query {
    askfred_threads {
      id
      title
      transcript_id
      user_id
      created_at
    }
  }
`;

export const askfredListCommand: CommandDefinition = {
  name: 'askfred_list',
  group: 'askfred',
  subcommand: 'list',
  description: 'List all AskFred AI conversation threads',
  examples: ['fireflies askfred list', 'fireflies askfred list --pretty'],
  inputSchema: z.object({}),
  cliMappings: {},
  handler: async (_input, client) => {
    const data = await client.query<{ askfred_threads: unknown[] }>(ASKFRED_THREADS_QUERY);
    return data.askfred_threads;
  },
};
