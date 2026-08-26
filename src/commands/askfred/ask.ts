import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const CREATE_ASKFRED_THREAD_MUTATION = `
  mutation CreateAskFredThread($input: CreateAskFredThreadInput!) {
    createAskFredThread(input: $input) {
      message
      cost
    }
  }
`;

export const askfredAskCommand: CommandDefinition = {
  name: 'askfred_ask',
  group: 'askfred',
  subcommand: 'ask',
  description:
    'Start a new AskFred AI conversation. Ask natural-language questions about a specific meeting transcript or across all meetings.',
  examples: [
    'fireflies askfred ask --query "What were the main action items?"',
    'fireflies askfred ask --transcript-id abc123 --query "What did Alice say about the budget?"',
    'fireflies askfred ask --query "Summarize all meetings this week about product roadmap"',
  ],
  inputSchema: z.object({
    query: z.string().min(1),
    transcript_id: z.string().optional(),
  }),
  cliMappings: {
    options: [
      {
        field: 'query',
        flags: '-q, --query <question>',
        description: 'Natural language question to ask about the meeting(s)',
      },
      {
        field: 'transcript_id',
        flags: '--transcript-id <id>',
        description: 'Scope the question to a specific transcript (omit to search all)',
      },
    ],
  },
  handler: async (input, client) => {
    const threadInput: Record<string, unknown> = { query: input.query };
    if (input.transcript_id) threadInput['transcript_id'] = input.transcript_id;

    const data = await client.mutate<{ createAskFredThread: unknown }>(
      CREATE_ASKFRED_THREAD_MUTATION,
      { input: threadInput },
    );
    return data.createAskFredThread;
  },
};
