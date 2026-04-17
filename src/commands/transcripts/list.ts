import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const TRANSCRIPTS_QUERY = `
  query Transcripts(
    $limit: Int
    $skip: Int
    $keyword: String
    $fromDate: DateTime
    $toDate: DateTime
    $host_email: String
    $mine: Boolean
  ) {
    transcripts(
      limit: $limit
      skip: $skip
      keyword: $keyword
      fromDate: $fromDate
      toDate: $toDate
      host_email: $host_email
      mine: $mine
    ) {
      id
      title
      date
      dateString
      duration
      privacy
      host_email
      organizer_email
      transcript_url
      participants
      speakers {
        id
        name
      }
    }
  }
`;

export const transcriptsListCommand: CommandDefinition = {
  name: 'transcripts_list',
  group: 'transcripts',
  subcommand: 'list',
  description:
    'List transcripts with optional filters (keyword search, date range, host email, mine only)',
  examples: [
    'fireflies transcripts list',
    'fireflies transcripts list --limit 20 --pretty',
    'fireflies transcripts list --keyword "product roadmap"',
    'fireflies transcripts list --from-date 2025-01-01 --to-date 2025-03-31',
    'fireflies transcripts list --host-email ceo@company.com',
    'fireflies transcripts list --mine',
  ],
  inputSchema: z.object({
    limit: z.coerce.number().min(1).max(50).optional().default(10),
    skip: z.coerce.number().optional(),
    keyword: z.string().optional(),
    from_date: z.string().optional(),
    to_date: z.string().optional(),
    host_email: z.string().optional(),
    mine: z.boolean().optional(),
  }),
  cliMappings: {
    options: [
      { field: 'limit', flags: '-l, --limit <n>', description: 'Max results (1-50, default 10)' },
      { field: 'skip', flags: '--skip <n>', description: 'Pagination offset' },
      { field: 'keyword', flags: '-k, --keyword <text>', description: 'Full-text search keyword' },
      { field: 'from_date', flags: '--from-date <date>', description: 'Start date (ISO 8601)' },
      { field: 'to_date', flags: '--to-date <date>', description: 'End date (ISO 8601)' },
      {
        field: 'host_email',
        flags: '--host-email <email>',
        description: 'Filter by host email',
      },
      { field: 'mine', flags: '--mine', description: 'Only my meetings' },
    ],
  },
  handler: async (input, client) => {
    const variables: Record<string, unknown> = {
      limit: input.limit,
    };
    if (input.skip !== undefined) variables['skip'] = input.skip;
    if (input.keyword) variables['keyword'] = input.keyword;
    if (input.from_date) variables['fromDate'] = input.from_date;
    if (input.to_date) variables['toDate'] = input.to_date;
    if (input.host_email) variables['host_email'] = input.host_email;
    if (input.mine !== undefined) variables['mine'] = input.mine;

    const data = await client.query<{ transcripts: unknown[] }>(TRANSCRIPTS_QUERY, variables);
    return data.transcripts;
  },
};
