import { askfredListCommand } from './list.js';
import { askfredGetCommand } from './get.js';
import { askfredAskCommand } from './ask.js';
import { askfredReplyCommand } from './reply.js';
import { askfredDeleteCommand } from './delete.js';

export {
  askfredListCommand,
  askfredGetCommand,
  askfredAskCommand,
  askfredReplyCommand,
  askfredDeleteCommand,
};

export const askfredCommands = [
  askfredListCommand,
  askfredGetCommand,
  askfredAskCommand,
  askfredReplyCommand,
  askfredDeleteCommand,
];
