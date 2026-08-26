import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const CREATE_BITE_MUTATION = `
  mutation CreateBite(
    $transcript_id: ID!
    $start_time: Float!
    $end_time: Float!
    $name: String
    $media_type: String
    $summary: String
  ) {
    createBite(
      transcript_Id: $transcript_id
      start_time: $start_time
      end_time: $end_time
      name: $name
      media_type: $media_type
      summary: $summary
    ) {
      id
      name
      transcript_id
      start_time
      end_time
    }
  }
`;

export const bitesCreateCommand: CommandDefinition = {
  name: 'bites_create',
  group: 'bites',
  subcommand: 'create',
  description: 'Create a soundbite clip from a transcript by specifying start and end timestamps',
  examples: [
    'fireflies bites create --transcript-id abc123 --start 120 --end 180',
    'fireflies bites create --transcript-id abc123 --start 120 --end 180 --name "Key insight"',
  ],
  inputSchema: z.object({
    transcript_id: z.string().min(1),
    start: z.coerce.number().min(0),
    end: z.coerce.number().min(0),
    name: z.string().optional(),
    media_type: z.string().optional(),
    summary: z.string().optional(),
  }),
  cliMappings: {
    options: [
      { field: 'transcript_id', flags: '--transcript-id <id>', description: 'Source transcript ID' },
      { field: 'start', flags: '--start <seconds>', description: 'Start time in seconds' },
      { field: 'end', flags: '--end <seconds>', description: 'End time in seconds' },
      { field: 'name', flags: '--name <name>', description: 'Soundbite name' },
      { field: 'media_type', flags: '--media-type <type>', description: 'Media type (audio/video)' },
      { field: 'summary', flags: '--summary <text>', description: 'Summary text' },
    ],
  },
  handler: async (input, client) => {
    const variables: Record<string, unknown> = {
      transcript_id: input.transcript_id,
      start_time: input.start,
      end_time: input.end,
    };
    if (input.name) variables['name'] = input.name;
    if (input.media_type) variables['media_type'] = input.media_type;
    if (input.summary) variables['summary'] = input.summary;

    const data = await client.mutate<{ createBite: unknown }>(CREATE_BITE_MUTATION, variables);
    return data.createBite;
  },
};
