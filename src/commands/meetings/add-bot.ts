import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const ADD_TO_LIVE_MUTATION = `
  mutation AddToLiveMeeting(
    $meeting_link: String!
    $title: String
    $meeting_password: String
    $duration: Int
    $language: String
    $attendees: [AttendeeInput!]
  ) {
    addToLiveMeeting(
      meeting_link: $meeting_link
      title: $title
      meeting_password: $meeting_password
      duration: $duration
      language: $language
      attendees: $attendees
    ) {
      success
      message
    }
  }
`;

export const meetingsAddBotCommand: CommandDefinition = {
  name: 'meetings_add_bot',
  group: 'meetings',
  subcommand: 'add-bot',
  description:
    'Add the Fireflies bot to an active meeting link to start live recording and transcription. Rate limited to 3 requests per 20 minutes.',
  examples: [
    'fireflies meetings add-bot --link https://meet.google.com/abc-defg-hij',
    'fireflies meetings add-bot --link https://zoom.us/j/123456789 --title "Standup" --duration 30',
    'fireflies meetings add-bot --link https://zoom.us/j/123 --password abc123',
  ],
  inputSchema: z.object({
    link: z.string().url(),
    title: z.string().optional(),
    password: z.string().optional(),
    duration: z.coerce.number().int().min(15).max(120).optional(),
    language: z.string().optional(),
  }),
  cliMappings: {
    options: [
      { field: 'link', flags: '--link <url>', description: 'Meeting URL (Google Meet, Zoom, etc.)' },
      { field: 'title', flags: '--title <title>', description: 'Meeting title' },
      { field: 'password', flags: '--password <pass>', description: 'Meeting password if required' },
      {
        field: 'duration',
        flags: '--duration <min>',
        description: 'Max recording duration in minutes (15-120)',
      },
      {
        field: 'language',
        flags: '--language <code>',
        description: 'Language code (e.g., en, es, fr)',
      },
    ],
  },
  handler: async (input, client) => {
    const variables: Record<string, unknown> = { meeting_link: input.link };
    if (input.title) variables['title'] = input.title;
    if (input.password) variables['meeting_password'] = input.password;
    if (input.duration !== undefined) variables['duration'] = input.duration;
    if (input.language) variables['language'] = input.language;

    const data = await client.mutate<{ addToLiveMeeting: unknown }>(
      ADD_TO_LIVE_MUTATION,
      variables,
    );
    return data.addToLiveMeeting;
  },
};
