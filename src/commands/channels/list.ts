import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const CHANNELS_QUERY = `
  query {
    channels {
      id
      name
      privacy
      members
    }
  }
`;

export const channelsListCommand: CommandDefinition = {
  name: 'channels_list',
  group: 'channels',
  subcommand: 'list',
  description: 'List all accessible channels (public channels and private channels where you are a member)',
  examples: ['fireflies channels list', 'fireflies channels list --pretty'],
  inputSchema: z.object({}),
  cliMappings: {},
  handler: async (_input, client) => {
    const data = await client.query<{ channels: unknown[] }>(CHANNELS_QUERY);
    return data.channels;
  },
};
