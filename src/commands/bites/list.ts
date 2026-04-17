import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const BITES_QUERY = `
  query Bites($limit: Int, $skip: Int) {
    bites(limit: $limit, skip: $skip) {
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

export const bitesListCommand: CommandDefinition = {
  name: 'bites_list',
  group: 'bites',
  subcommand: 'list',
  description: 'List soundbite clips',
  examples: ['fireflies bites list', 'fireflies bites list --limit 20 --pretty'],
  inputSchema: z.object({
    limit: z.coerce.number().optional(),
    skip: z.coerce.number().optional(),
  }),
  cliMappings: {
    options: [
      { field: 'limit', flags: '-l, --limit <n>', description: 'Max results' },
      { field: 'skip', flags: '--skip <n>', description: 'Pagination offset' },
    ],
  },
  handler: async (input, client) => {
    const variables: Record<string, unknown> = {};
    if (input.limit !== undefined) variables['limit'] = input.limit;
    if (input.skip !== undefined) variables['skip'] = input.skip;
    const data = await client.query<{ bites: unknown[] }>(BITES_QUERY, variables);
    return data.bites;
  },
};
