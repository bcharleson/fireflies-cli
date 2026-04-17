import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const BITE_QUERY = `
  query Bite($id: String!) {
    bite(id: $id) {
      id
      transcript_id
      name
      start_time
      end_time
      media_type
      summary
    }
  }
`;

export const bitesGetCommand: CommandDefinition = {
  name: 'bites_get',
  group: 'bites',
  subcommand: 'get',
  description: 'Get a single soundbite by ID',
  examples: ['fireflies bites get bite123'],
  inputSchema: z.object({
    id: z.string().min(1),
  }),
  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true, description: 'Soundbite ID' }],
  },
  handler: async (input, client) => {
    const data = await client.query<{ bite: unknown }>(BITE_QUERY, { id: input.id });
    return data.bite;
  },
};
