import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const TRANSCRIPT_QUERY = `
  query Transcript($id: String!) {
    transcript(id: $id) {
      id
      title
      date
      dateString
      duration
      privacy
      transcript_url
      audio_url
      video_url
      is_live
      meeting_link
      calendar_type
      host_email
      organizer_email
      participants
      speakers {
        id
        name
      }
      meeting_attendees {
        displayName
        email
        phoneNumber
      }
      sentences {
        speaker_name
        speaker_id
        text
        start_time
        end_time
      }
      summary {
        keywords
        action_items
        outline
        shorthand_bullet
        overview
        bullet_gist
        gist
        short_summary
        meeting_type
        topics_discussed
      }
      user {
        user_id
        name
        email
      }
    }
  }
`;

export const transcriptsGetCommand: CommandDefinition = {
  name: 'transcripts_get',
  group: 'transcripts',
  subcommand: 'get',
  description:
    'Get a full transcript by ID — includes sentences, AI summary, speakers, action items, and analytics',
  examples: [
    'fireflies transcripts get abc123',
    'fireflies transcripts get abc123 --pretty',
    'fireflies transcripts get abc123 --summary-only',
  ],
  inputSchema: z.object({
    id: z.string().min(1),
    summary_only: z.boolean().optional(),
  }),
  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true, description: 'Transcript ID' }],
    options: [
      {
        field: 'summary_only',
        flags: '--summary-only',
        description: 'Return only the AI summary fields',
      },
    ],
  },
  handler: async (input, client) => {
    const data = await client.query<{ transcript: Record<string, unknown> }>(TRANSCRIPT_QUERY, {
      id: input.id,
    });

    if (input.summary_only) {
      return {
        id: data.transcript['id'],
        title: data.transcript['title'],
        date: data.transcript['date'],
        summary: data.transcript['summary'],
      };
    }

    return data.transcript;
  },
};
