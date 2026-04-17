import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const SET_CHANNEL_MUTATION = `
  mutation UpdateMeetingChannel($transcript_ids: [String!]!, $channel_id: String!) {
    updateMeetingChannel(transcript_ids: $transcript_ids, channel_id: $channel_id) {
      success
      message
    }
  }
`;

export const meetingsSetChannelCommand: CommandDefinition = {
  name: 'meetings_set_channel',
  group: 'meetings',
  subcommand: 'set-channel',
  description: 'Assign one or more transcripts to a channel (batch, max 5 at a time)',
  examples: [
    'fireflies meetings set-channel --ids abc123 --channel ch456',
    'fireflies meetings set-channel --ids abc123,def456,ghi789 --channel ch456',
  ],
  inputSchema: z.object({
    ids: z.string().min(1),
    channel: z.string().min(1),
  }),
  cliMappings: {
    options: [
      {
        field: 'ids',
        flags: '--ids <ids>',
        description: 'Comma-separated transcript IDs (max 5)',
      },
      { field: 'channel', flags: '--channel <id>', description: 'Channel ID to assign to' },
    ],
  },
  handler: async (input, client) => {
    const transcriptIds = input.ids.split(',').map((id: string) => id.trim());
    if (transcriptIds.length > 5) {
      throw new Error('Maximum 5 transcript IDs allowed per request');
    }

    const data = await client.mutate<{ updateMeetingChannel: unknown }>(SET_CHANNEL_MUTATION, {
      transcript_ids: transcriptIds,
      channel_id: input.channel,
    });
    return data.updateMeetingChannel;
  },
};
