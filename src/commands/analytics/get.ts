import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const ANALYTICS_QUERY = `
  query Analytics($start_time: DateTime, $end_time: DateTime) {
    analytics(start_time: $start_time, end_time: $end_time) {
      team_meetings
      team_hours
      avg_duration
      users {
        user_id
        name
        email
        num_meetings
        hours
        words_per_minute
        questions
        filler_words
        longest_monologue
        talk_ratio
      }
    }
  }
`;

export const analyticsGetCommand: CommandDefinition = {
  name: 'analytics_get',
  group: 'analytics',
  subcommand: 'get',
  description:
    'Get team conversation analytics including per-user stats (Business plan + admin required)',
  examples: [
    'fireflies analytics get',
    'fireflies analytics get --from 2025-01-01 --to 2025-03-31',
    'fireflies analytics get --pretty',
  ],
  inputSchema: z.object({
    from: z.string().optional(),
    to: z.string().optional(),
  }),
  cliMappings: {
    options: [
      { field: 'from', flags: '--from <date>', description: 'Start date (ISO 8601)' },
      { field: 'to', flags: '--to <date>', description: 'End date (ISO 8601)' },
    ],
  },
  handler: async (input, client) => {
    const variables: Record<string, unknown> = {};
    if (input.from) variables['start_time'] = input.from;
    if (input.to) variables['end_time'] = input.to;

    const data = await client.query<{ analytics: unknown }>(ANALYTICS_QUERY, variables);
    return data.analytics;
  },
};
