import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const USER_ME_QUERY = `
  query {
    user {
      user_id
      name
      email
      num_transcripts
      recent_meeting
      minutes_consumed
      is_admin
      integrations
    }
  }
`;

export const usersMeCommand: CommandDefinition = {
  name: 'users_me',
  group: 'users',
  subcommand: 'me',
  description: 'Get your own user profile, transcript count, and integration status',
  examples: ['fireflies users me', 'fireflies users me --pretty'],
  inputSchema: z.object({}),
  cliMappings: {},
  handler: async (_input, client) => {
    const data = await client.query<{ user: unknown }>(USER_ME_QUERY);
    return data.user;
  },
};
