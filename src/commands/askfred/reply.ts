import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const CONTINUE_ASKFRED_THREAD_MUTATION = `
  mutation ContinueAskFredThread($thread_id: String!, $query: String!) {
    continueAskFredThread(thread_id: $thread_id, query: $query) {
      id
      messages {
        role
        content
      }
    }
  }
`;

export const askfredReplyCommand: CommandDefinition = {
  name: 'askfred_reply',
  group: 'askfred',
  subcommand: 'reply',
  description: 'Continue an existing AskFred AI conversation thread with a follow-up question',
  examples: [
    'fireflies askfred reply thread123 --query "Can you elaborate on the budget discussion?"',
    'fireflies askfred reply thread123 -q "Who is responsible for that action item?"',
  ],
  inputSchema: z.object({
    id: z.string().min(1),
    query: z.string().min(1),
  }),
  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true, description: 'Thread ID to continue' }],
    options: [
      {
        field: 'query',
        flags: '-q, --query <question>',
        description: 'Follow-up question',
      },
    ],
  },
  handler: async (input, client) => {
    const data = await client.mutate<{ continueAskFredThread: unknown }>(
      CONTINUE_ASKFRED_THREAD_MUTATION,
      { thread_id: input.id, query: input.query },
    );
    return data.continueAskFredThread;
  },
};
