import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const CREATE_UPLOAD_URL_MUTATION = `
  mutation CreateUploadUrl($input: CreateUploadUrlInput!) {
    createUploadUrl(input: $input) {
      upload_url
      meeting_id
      expires_at
    }
  }
`;

export const uploadCreateUrlCommand: CommandDefinition = {
  name: 'upload_create_url',
  group: 'upload',
  subcommand: 'create-url',
  description:
    'Generate a pre-signed URL for direct file upload to Fireflies. Use this when you need to upload a file directly rather than providing a public URL.',
  examples: [
    'fireflies upload create-url --content-type audio/mpeg --file-size 10485760',
    'fireflies upload create-url --content-type video/mp4 --file-size 104857600 --title "Sales Call"',
  ],
  inputSchema: z.object({
    content_type: z.string().min(1),
    file_size: z.coerce.number().int().positive(),
    title: z.string().optional(),
    language: z.string().optional(),
  }),
  cliMappings: {
    options: [
      { field: 'content_type', flags: '--content-type <mime>', description: 'MIME type of the file' },
      { field: 'file_size', flags: '--file-size <bytes>', description: 'File size in bytes' },
      { field: 'title', flags: '--title <title>', description: 'Meeting title for the transcript' },
      { field: 'language', flags: '--language <code>', description: 'Language code (e.g., en, es, fr)' },
    ],
  },
  handler: async (input, client) => {
    const data = await client.mutate<{
      createUploadUrl: { upload_url: string; meeting_id: string; expires_at: string };
    }>(CREATE_UPLOAD_URL_MUTATION, {
      input: {
        content_type: input.content_type,
        file_size: input.file_size,
        ...(input.title ? { title: input.title } : {}),
        ...(input.language ? { custom_language: input.language } : {}),
      },
    });
    return data.createUploadUrl;
  },
};
