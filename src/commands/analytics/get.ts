import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const ANALYTICS_QUERY = `
  query Analytics($start_time: String, $end_time: String) {
    analytics(start_time: $start_time, end_time: $end_time) {
      team {
        meeting {
          count
          duration
          average_count
          average_duration
        }
        conversation {
          average_filler_words
          average_questions
          average_words_per_minute
          average_talk_listen_ratio
          longest_monologue_duration_sec
          total_filler_words
          total_questions
        }
      }
      users {
        user_id
        user_name
        user_email
        meeting {
          count
          duration
        }
        conversation {
          user_words_per_minute
          user_questions
          user_filler_words
          user_longest_monologue_sec
          talk_listen_ratio
        }
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
