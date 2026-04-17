import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const DELETE_ASKFRED_THREAD_MUTATION = `
  mutation DeleteAskFredThread($thread_id: String!) {
    deleteAskFredThread(thread_id: $thread_id) {
      success
      message
    }
  }
`;

export const askfredDeleteCommand: CommandDefinition = {
  name: 'askfred_delete',
  group: 'askfred',
  subcommand: 'delete',
  description: 'Delete an AskFred AI conversation thread',
  examples: ['fireflies askfred delete thread123'],
  inputSchema: z.object({
    id: z.string().min(1),
  }),
  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true, description: 'Thread ID to delete' }],
  },
  handler: async (input, client) => {
    const data = await client.mutate<{ deleteAskFredThread: unknown }>(
      DELETE_ASKFRED_THREAD_MUTATION,
      { thread_id: input.id },
    );
    return data.deleteAskFredThread;
  },
};
