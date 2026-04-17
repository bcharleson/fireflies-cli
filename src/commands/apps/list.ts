import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const APPS_QUERY = `
  query Apps($app_id: String, $transcript_id: String, $skip: Int, $limit: Int) {
    apps(app_id: $app_id, transcript_id: $transcript_id, skip: $skip, limit: $limit) {
      app_id
      transcript_id
      output
    }
  }
`;

export const appsListCommand: CommandDefinition = {
  name: 'apps_list',
  group: 'apps',
  subcommand: 'list',
  description:
    'List AI App outputs for meetings. Apps run custom prompts across meetings and return structured outputs.',
  examples: [
    'fireflies apps list',
    'fireflies apps list --app-id myapp123',
    'fireflies apps list --transcript-id abc123',
    'fireflies apps list --limit 5 --pretty',
  ],
  inputSchema: z.object({
    app_id: z.string().optional(),
    transcript_id: z.string().optional(),
    limit: z.coerce.number().max(10).optional(),
    skip: z.coerce.number().optional(),
  }),
  cliMappings: {
    options: [
      { field: 'app_id', flags: '--app-id <id>', description: 'Filter by AI App ID' },
      {
        field: 'transcript_id',
        flags: '--transcript-id <id>',
        description: 'Filter by transcript ID',
      },
      { field: 'limit', flags: '-l, --limit <n>', description: 'Max results (max 10)' },
      { field: 'skip', flags: '--skip <n>', description: 'Pagination offset' },
    ],
  },
  handler: async (input, client) => {
    const variables: Record<string, unknown> = {};
    if (input.app_id) variables['app_id'] = input.app_id;
    if (input.transcript_id) variables['transcript_id'] = input.transcript_id;
    if (input.limit !== undefined) variables['limit'] = input.limit;
    if (input.skip !== undefined) variables['skip'] = input.skip;

    const data = await client.query<{ apps: unknown[] }>(APPS_QUERY, variables);
    return data.apps;
  },
};
