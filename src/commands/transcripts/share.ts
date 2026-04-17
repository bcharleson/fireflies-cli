import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const SHARE_MUTATION = `
  mutation ShareMeeting($id: String!, $emails: [String!]!, $expiry: DateTime) {
    shareMeeting(id: $id, emails: $emails, expiry: $expiry) {
      success
      message
    }
  }
`;

export const transcriptsShareCommand: CommandDefinition = {
  name: 'transcripts_share',
  group: 'transcripts',
  subcommand: 'share',
  description:
    'Share a transcript with a list of email addresses (up to 100). Rate limited to 10 requests/hour.',
  examples: [
    'fireflies transcripts share abc123 --emails alice@co.com,bob@co.com',
    'fireflies transcripts share abc123 --emails alice@co.com --expiry 2026-06-01',
  ],
  inputSchema: z.object({
    id: z.string().min(1),
    emails: z.string().min(1),
    expiry: z.string().optional(),
  }),
  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true, description: 'Transcript ID' }],
    options: [
      {
        field: 'emails',
        flags: '--emails <emails>',
        description: 'Comma-separated email addresses (max 100)',
      },
      { field: 'expiry', flags: '--expiry <date>', description: 'Expiry date (ISO 8601)' },
    ],
  },
  handler: async (input, client) => {
    const emails = input.emails.split(',').map((e: string) => e.trim());
    const variables: Record<string, unknown> = { id: input.id, emails };
    if (input.expiry) variables['expiry'] = input.expiry;

    const data = await client.mutate<{ shareMeeting: unknown }>(SHARE_MUTATION, variables);
    return data.shareMeeting;
  },
};
