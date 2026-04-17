import { z } from 'zod';
import { input as promptInput } from '@inquirer/prompts';
import type { CommandDefinition } from '../../core/types.js';
import { writeConfig, clearConfig, getConfigPath } from '../../core/config.js';
import { resolveApiKey } from '../../core/auth.js';
import { createClient } from '../../core/client.js';
import { AuthError } from '../../core/errors.js';

const USER_QUERY = `
  query {
    user {
      user_id
      name
      email
      num_transcripts
      is_admin
    }
  }
`;

export const loginCommand: CommandDefinition<z.ZodObject<{ api_key: z.ZodOptional<z.ZodString> }>> =
  {
    name: 'auth_login',
    group: 'auth',
    subcommand: 'login',
    description: 'Save your Fireflies API key to the local config file',
    examples: [
      'fireflies login',
      'fireflies login --api-key YOUR_API_KEY',
      'FIREFLIES_API_KEY=xxx fireflies login',
    ],
    inputSchema: z.object({
      api_key: z.string().optional(),
    }),
    cliMappings: {
      options: [{ field: 'api_key', flags: '--api-key <key>', description: 'Fireflies API key' }],
    },
    handler: async (input) => {
      let apiKey = input.api_key ?? process.env['FIREFLIES_API_KEY'];

      if (!apiKey) {
        apiKey = await promptInput({ message: 'Enter your Fireflies API key:' });
      }

      if (!apiKey?.trim()) {
        throw new AuthError('API key cannot be empty');
      }

      // Validate the key by calling the API
      const client = createClient(apiKey.trim());
      const data = await client.query<{ user: { user_id: string; name: string; email: string } }>(
        USER_QUERY,
      );

      await writeConfig({ apiKey: apiKey.trim() });

      return {
        success: true,
        message: `Logged in as ${data.user.name} (${data.user.email})`,
        config_path: getConfigPath(),
      };
    },
  };

export const logoutCommand: CommandDefinition<z.ZodObject<Record<never, never>>> = {
  name: 'auth_logout',
  group: 'auth',
  subcommand: 'logout',
  description: 'Remove stored Fireflies credentials from the local config file',
  examples: ['fireflies logout'],
  inputSchema: z.object({}),
  cliMappings: {},
  handler: async () => {
    await clearConfig();
    return { success: true, message: 'Logged out. API key removed from config.' };
  },
};

export const statusCommand: CommandDefinition<z.ZodObject<{ api_key: z.ZodOptional<z.ZodString> }>> =
  {
    name: 'auth_status',
    group: 'auth',
    subcommand: 'status',
    description: 'Show current authentication status and workspace info',
    examples: ['fireflies status', 'fireflies status --api-key xxx'],
    inputSchema: z.object({
      api_key: z.string().optional(),
    }),
    cliMappings: {
      options: [{ field: 'api_key', flags: '--api-key <key>', description: 'Fireflies API key' }],
    },
    handler: async (input) => {
      const { apiKey, source } = await resolveApiKey(input.api_key);
      const client = createClient(apiKey);
      const data = await client.query<{
        user: {
          user_id: string;
          name: string;
          email: string;
          num_transcripts: number;
          is_admin: boolean;
          minutes_consumed: number;
        };
      }>(USER_QUERY);

      return {
        authenticated: true,
        source,
        user: data.user,
      };
    },
  };

export const authCommands: CommandDefinition[] = [
  loginCommand as unknown as CommandDefinition,
  logoutCommand as unknown as CommandDefinition,
  statusCommand as unknown as CommandDefinition,
];
