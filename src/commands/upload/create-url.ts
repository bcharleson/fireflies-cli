import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const CREATE_UPLOAD_URL_MUTATION = `
  mutation {
    createUploadUrl {
      url
      transcript_id
    }
  }
`;

export const uploadCreateUrlCommand: CommandDefinition = {
  name: 'upload_create_url',
  group: 'upload',
  subcommand: 'create-url',
  description:
    'Generate a pre-signed URL for direct file upload to Fireflies. Use this when you need to upload a file directly rather than providing a public URL.',
  examples: ['fireflies upload create-url', 'fireflies upload create-url --pretty'],
  inputSchema: z.object({}),
  cliMappings: {},
  handler: async (_input, client) => {
    const data = await client.mutate<{ createUploadUrl: { url: string; transcript_id: string } }>(
      CREATE_UPLOAD_URL_MUTATION,
    );
    return data.createUploadUrl;
  },
};
