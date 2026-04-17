export { transcriptsListCommand } from './list.js';
export { transcriptsGetCommand } from './get.js';
export { transcriptsDeleteCommand } from './delete.js';
export { transcriptsUpdateTitleCommand } from './update-title.js';
export { transcriptsUpdatePrivacyCommand } from './update-privacy.js';
export { transcriptsShareCommand } from './share.js';
export { transcriptsRevokeCommand } from './revoke.js';

import { transcriptsListCommand } from './list.js';
import { transcriptsGetCommand } from './get.js';
import { transcriptsDeleteCommand } from './delete.js';
import { transcriptsUpdateTitleCommand } from './update-title.js';
import { transcriptsUpdatePrivacyCommand } from './update-privacy.js';
import { transcriptsShareCommand } from './share.js';
import { transcriptsRevokeCommand } from './revoke.js';

export const transcriptCommands = [
  transcriptsListCommand,
  transcriptsGetCommand,
  transcriptsDeleteCommand,
  transcriptsUpdateTitleCommand,
  transcriptsUpdatePrivacyCommand,
  transcriptsShareCommand,
  transcriptsRevokeCommand,
];
