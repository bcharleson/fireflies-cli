import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const CONTINUE_ASKFRED_THREAD_MUTATION = `
  mutation ContinueAskFredThread($input: ContinueAskFredThreadInput!) {
    continueAskFredThread(input: $input) {
      message {
        id
        thread_id
        query
        answer
        suggested_queries
        status
        created_at
        updated_at
      }
      cost
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
      { input: { thread_id: input.id, query: input.query } },
    );
    return data.continueAskFredThread;
  },
};
