import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const REVOKE_MUTATION = `
  mutation RevokeSharedMeetingAccess($id: String!, $email: String!) {
    revokeSharedMeetingAccess(id: $id, email: $email) {
      success
      message
    }
  }
`;

export const transcriptsRevokeCommand: CommandDefinition = {
  name: 'transcripts_revoke',
  group: 'transcripts',
  subcommand: 'revoke',
  description: "Revoke a specific user's access to a shared transcript",
  examples: ['fireflies transcripts revoke abc123 --email alice@co.com'],
  inputSchema: z.object({
    id: z.string().min(1),
    email: z.string().email(),
  }),
  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true, description: 'Transcript ID' }],
    options: [
      {
        field: 'email',
        flags: '--email <email>',
        description: "Email address of the user whose access to revoke",
      },
    ],
  },
  handler: async (input, client) => {
    const data = await client.mutate<{ revokeSharedMeetingAccess: unknown }>(REVOKE_MUTATION, {
      id: input.id,
      email: input.email,
    });
    return data.revokeSharedMeetingAccess;
  },
};
