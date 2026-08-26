import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const GROUPS_QUERY = `
  query {
    user_groups {
      id
      name
      handle
      members {
        user_id
        first_name
        last_name
        email
      }
    }
  }
`;

export const groupsListCommand: CommandDefinition = {
  name: 'groups_list',
  group: 'groups',
  subcommand: 'list',
  description: 'List user groups in the workspace',
  examples: ['fireflies groups list', 'fireflies groups list --pretty'],
  inputSchema: z.object({}),
  cliMappings: {},
  handler: async (_input, client) => {
    const data = await client.query<{ user_groups: unknown[] }>(GROUPS_QUERY);
    return data.user_groups;
  },
};
