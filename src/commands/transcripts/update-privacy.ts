import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';

const UPDATE_PRIVACY_MUTATION = `
  mutation UpdateMeetingPrivacy($input: UpdateMeetingPrivacyInput!) {
    updateMeetingPrivacy(input: $input) {
      id
      privacy
    }
  }
`;

const PRIVACY_LEVELS = ['link', 'owner', 'participants', 'participatingteammates', 'teammatesandparticipants', 'teammates'] as const;

export const transcriptsUpdatePrivacyCommand: CommandDefinition = {
  name: 'transcripts_update_privacy',
  group: 'transcripts',
  subcommand: 'update-privacy',
  description:
    'Set the access level for a transcript. Valid levels: link, owner, participants, participatingteammates, teammatesandparticipants, teammates',
  examples: ['fireflies transcripts update-privacy abc123 --privacy participants'],
  inputSchema: z.object({
    id: z.string().min(1),
    privacy: z.enum(PRIVACY_LEVELS),
  }),
  cliMappings: {
    args: [{ field: 'id', name: 'id', required: true, description: 'Transcript ID' }],
    options: [
      {
        field: 'privacy',
        flags: '--privacy <level>',
        description: 'Access level: link | owner | participants | participatingteammates | teammatesandparticipants | teammates',
      },
    ],
  },
  handler: async (input, client) => {
    const data = await client.mutate<{ updateMeetingPrivacy: unknown }>(UPDATE_PRIVACY_MUTATION, {
      input: { id: input.id, privacy: input.privacy },
    });
    return data.updateMeetingPrivacy;
  },
};
