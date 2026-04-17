import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const USERS_QUERY = `
  query {
    users {
      user_id
      name
      email
      num_transcripts
      is_admin
      integrations
    }
  }
`;

export const usersListCommand: CommandDefinition = {
  name: 'users_list',
  group: 'users',
  subcommand: 'list',
  description: 'List all users on the team',
  examples: ['fireflies users list', 'fireflies users list --pretty'],
  inputSchema: z.object({}),
  cliMappings: {},
  handler: async (_input, client) => {
    const data = await client.query<{ users: unknown[] }>(USERS_QUERY);
    return data.users;
  },
};
