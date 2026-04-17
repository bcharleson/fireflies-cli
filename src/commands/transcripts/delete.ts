import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const DELETE_TRANSCRIPT_MUTATION = `
  mutation DeleteTranscript($id: String!) {
    deleteTranscript(id: $id) {
      success
      message
    }
  }
`;

export const transcriptsDeleteCommand: CommandDefinition = {
  name: 'transcripts_delete',
  group: 'transcripts',
  subcommand: 'delete',
  description: 'Delete a transcript by ID. Rate limited to 10 requests per minute.',
  examples: ['fireflies transcripts delete abc123'],
  inputSchema: z.object({
    id: z.string().min(1),
  }),
  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true, description: 'Transcript ID to delete' }],
  },
  handler: async (input, client) => {
    const data = await client.mutate<{ deleteTranscript: unknown }>(DELETE_TRANSCRIPT_MUTATION, {
      id: input.id,
    });
    return data.deleteTranscript;
  },
};
