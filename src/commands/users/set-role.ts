import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const SET_USER_ROLE_MUTATION = `
  mutation SetUserRole($user_id: String!, $role: Role!) {
    setUserRole(user_id: $user_id, role: $role) {
      user_id
      name
      email
    }
  }
`;

const ROLES = ['admin', 'user'] as const;

export const usersSetRoleCommand: CommandDefinition = {
  name: 'users_set_role',
  group: 'users',
  subcommand: 'set-role',
  description: 'Assign a role to a team user (admin only)',
  examples: [
    'fireflies users set-role --user-id usr123 --role admin',
    'fireflies users set-role --user-id usr123 --role member',
  ],
  inputSchema: z.object({
    user_id: z.string().min(1),
    role: z.enum(ROLES),
  }),
  cliMappings: {
    options: [
      { field: 'user_id', flags: '--user-id <id>', description: 'User ID to update' },
      { field: 'role', flags: '--role <role>', description: 'Role to assign: admin | user' },
    ],
  },
  handler: async (input, client) => {
    const data = await client.mutate<{ setUserRole: unknown }>(SET_USER_ROLE_MUTATION, {
      user_id: input.user_id,
      role: input.role,
    });
    return data.setUserRole;
  },
};
