import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const UPDATE_TITLE_MUTATION = `
  mutation UpdateMeetingTitle($input: UpdateMeetingTitleInput!) {
    updateMeetingTitle(input: $input) {
      id
      title
    }
  }
`;

export const transcriptsUpdateTitleCommand: CommandDefinition = {
  name: 'transcripts_update_title',
  group: 'transcripts',
  subcommand: 'update-title',
  description: 'Rename a meeting transcript',
  examples: ['fireflies transcripts update-title abc123 --title "Q1 Strategy Review"'],
  inputSchema: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
  }),
  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true, description: 'Transcript ID' }],
    options: [{ field: 'title', flags: '--title <title>', description: 'New meeting title' }],
  },
  handler: async (input, client) => {
    const data = await client.mutate<{ updateMeetingTitle: unknown }>(UPDATE_TITLE_MUTATION, {
      input: { id: input.id, title: input.title },
    });
    return data.updateMeetingTitle;
  },
};
