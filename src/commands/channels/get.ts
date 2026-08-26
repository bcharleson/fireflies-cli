import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const CHANNEL_QUERY = `
  query Channel($id: ID!) {
    channel(id: $id) {
      id
      title
      is_private
      members {
        user_id
        email
        name
      }
    }
  }
`;

export const channelsGetCommand: CommandDefinition = {
  name: 'channels_get',
  group: 'channels',
  subcommand: 'get',
  description: 'Get a channel by ID',
  examples: ['fireflies channels get ch123'],
  inputSchema: z.object({
    id: z.string().min(1),
  }),
  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true, description: 'Channel ID' }],
  },
  handler: async (input, client) => {
    const data = await client.query<{ channel: unknown }>(CHANNEL_QUERY, { id: input.id });
    return data.channel;
  },
};
