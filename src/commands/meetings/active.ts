import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const ACTIVE_MEETINGS_QUERY = `
  query {
    active_meetings {
      id
      title
      meeting_link
      organizer_email
      start_time
      end_time
      privacy
      state
    }
  }
`;

export const meetingsActiveCommand: CommandDefinition = {
  name: 'meetings_active',
  group: 'meetings',
  subcommand: 'active',
  description: 'List all currently in-progress live meetings being recorded by Fireflies',
  examples: ['fireflies meetings active', 'fireflies meetings active --pretty'],
  inputSchema: z.object({}),
  cliMappings: {},
  handler: async (_input, client) => {
    const data = await client.query<{ active_meetings: unknown[] }>(ACTIVE_MEETINGS_QUERY);
    return data.active_meetings;
  },
};
