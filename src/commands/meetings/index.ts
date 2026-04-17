import { meetingsActiveCommand } from './active.js';
import { meetingsAddBotCommand } from './add-bot.js';
import { meetingsSetChannelCommand } from './set-channel.js';

export { meetingsActiveCommand, meetingsAddBotCommand, meetingsSetChannelCommand };

export const meetingCommands = [
  meetingsActiveCommand,
  meetingsAddBotCommand,
  meetingsSetChannelCommand,
];
