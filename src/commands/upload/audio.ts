import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const UPLOAD_AUDIO_MUTATION = `
  mutation UploadAudio($input: AudioUploadInput!) {
    uploadAudio(input: $input) {
      success
      title
      message
    }
  }
`;

export const uploadAudioCommand: CommandDefinition = {
  name: 'upload_audio',
  group: 'upload',
  subcommand: 'audio',
  description:
    'Upload an audio or video file URL for transcription. Supports mp3, mp4, wav, m4a, ogg. Max 200MB audio / 1.5GB video (paid plans).',
  examples: [
    'fireflies upload audio --url https://example.com/recording.mp3',
    'fireflies upload audio --url https://example.com/call.mp4 --title "Sales Call Jan 15"',
    'fireflies upload audio --url https://example.com/meeting.mp3 --language es',
    'fireflies upload audio --url https://example.com/audio.mp3 --webhook https://myapp.com/webhook',
  ],
  inputSchema: z.object({
    url: z.string().url(),
    title: z.string().optional(),
    webhook: z.string().url().optional(),
    language: z.string().optional(),
    save_video: z.boolean().optional(),
    client_reference_id: z.string().optional(),
  }),
  cliMappings: {
    options: [
      { field: 'url', flags: '--url <url>', description: 'Public HTTPS URL of audio/video file' },
      { field: 'title', flags: '--title <title>', description: 'Meeting title for the transcript' },
      {
        field: 'webhook',
        flags: '--webhook <url>',
        description: 'Webhook URL to notify when transcription is complete',
      },
      {
        field: 'language',
        flags: '--language <code>',
        description: 'Language code (e.g., en, es, fr, de)',
      },
      { field: 'save_video', flags: '--save-video', description: 'Save video alongside transcript' },
      {
        field: 'client_reference_id',
        flags: '--ref <id>',
        description: 'Custom reference ID for your records',
      },
    ],
  },
  handler: async (input, client) => {
    const uploadInput: Record<string, unknown> = { url: input.url };
    if (input.title) uploadInput['title'] = input.title;
    if (input.webhook) uploadInput['webhook'] = input.webhook;
    if (input.language) uploadInput['custom_language'] = input.language;
    if (input.save_video !== undefined) uploadInput['save_video'] = input.save_video;
    if (input.client_reference_id)
      uploadInput['client_reference_id'] = input.client_reference_id;

    const data = await client.mutate<{ uploadAudio: unknown }>(UPLOAD_AUDIO_MUTATION, {
      input: uploadInput,
    });
    return data.uploadAudio;
  },
};
