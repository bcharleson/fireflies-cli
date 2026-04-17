import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const CONFIRM_UPLOAD_MUTATION = `
  mutation ConfirmUpload($session_id: String!) {
    confirmUpload(session_id: $session_id) {
      success
      title
      message
    }
  }
`;

export const uploadConfirmCommand: CommandDefinition = {
  name: 'upload_confirm',
  group: 'upload',
  subcommand: 'confirm',
  description:
    'Confirm a direct file upload and trigger transcription. Use after uploading a file to the pre-signed URL from upload create-url.',
  examples: ['fireflies upload confirm --session-id SESSION_ID_HERE'],
  inputSchema: z.object({
    session_id: z.string().min(1),
  }),
  cliMappings: {
    options: [
      {
        field: 'session_id',
        flags: '--session-id <id>',
        description: 'Session ID from the create-url response',
      },
    ],
  },
  handler: async (input, client) => {
    const data = await client.mutate<{ confirmUpload: unknown }>(CONFIRM_UPLOAD_MUTATION, {
      session_id: input.session_id,
    });
    return data.confirmUpload;
  },
};
