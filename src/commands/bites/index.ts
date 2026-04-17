import { bitesListCommand } from './list.js';
import { bitesGetCommand } from './get.js';
import { bitesCreateCommand } from './create.js';

export { bitesListCommand, bitesGetCommand, bitesCreateCommand };
export const bitesCommands = [bitesListCommand, bitesGetCommand, bitesCreateCommand];
