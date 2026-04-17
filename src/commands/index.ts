import { type Command } from 'commander';
import type { CommandDefinition } from '../core/types.js';
import { executeCommand } from '../core/handler.js';

// Import all command groups
import { authCommands } from './auth/index.js';
import { transcriptCommands } from './transcripts/index.js';
import { meetingCommands } from './meetings/index.js';
import { uploadCommands } from './upload/index.js';
import { askfredCommands } from './askfred/index.js';
import { bitesCommands } from './bites/index.js';
import { usersCommands } from './users/index.js';
import { channelsCommands } from './channels/index.js';
import { analyticsCommands } from './analytics/index.js';
import { appsCommands } from './apps/index.js';
import { groupsCommands } from './groups/index.js';

// Single source of truth — all 32 commands
export const allCommands: CommandDefinition[] = [
  ...authCommands,
  ...transcriptCommands,
  ...meetingCommands,
  ...uploadCommands,
  ...askfredCommands,
  ...bitesCommands,
  ...usersCommands,
  ...channelsCommands,
  ...analyticsCommands,
  ...appsCommands,
  ...groupsCommands,
];

/**
 * Register all commands onto a Commander.js program.
 * Auth commands register at top level; all others get a group subcommand.
 */
export function registerAllCommands(rootProgram: Command): void {
  const groups = new Map<string, CommandDefinition[]>();

  for (const cmd of allCommands) {
    if (!groups.has(cmd.group)) groups.set(cmd.group, []);
    groups.get(cmd.group)!.push(cmd);
  }

  for (const [group, commands] of groups) {
    // Auth commands at top level: fireflies login, fireflies logout, fireflies status
    if (group === 'auth') {
      for (const def of commands) {
        attachCommand(rootProgram, def, rootProgram);
      }
      continue;
    }

    // All other groups: fireflies transcripts list, fireflies meetings active, etc.
    const groupCmd = rootProgram
      .command(group)
      .description(`Fireflies ${group} commands`);

    for (const def of commands) {
      attachCommand(groupCmd, def, rootProgram);
    }
  }
}

function attachCommand(parent: Command, def: CommandDefinition, rootProgram: Command): void {
  const sub = parent.command(def.subcommand).description(def.description);

  // Positional args
  if (def.cliMappings.args) {
    for (const arg of def.cliMappings.args) {
      const argStr = arg.required !== false ? `<${arg.name}>` : `[${arg.name}]`;
      sub.argument(argStr, arg.description ?? arg.name);
    }
  }

  // Options
  if (def.cliMappings.options) {
    for (const opt of def.cliMappings.options) {
      sub.option(opt.flags, opt.description);
    }
  }

  // Examples in help text
  if (def.examples?.length) {
    sub.addHelpText(
      'after',
      '\nExamples:\n' + def.examples.map((e) => `  ${e}`).join('\n'),
    );
  }

  sub.action(async (...actionArgs) => {
    const cmd: Command = actionArgs[actionArgs.length - 1];
    const opts = cmd.opts<Record<string, unknown>>();

    // Global options live on the root program
    const globalOpts = rootProgram.opts<{ apiKey?: string; pretty?: boolean; quiet?: boolean }>();

    // Build input from positional args
    const input: Record<string, unknown> = {};
    if (def.cliMappings.args) {
      for (let i = 0; i < def.cliMappings.args.length; i++) {
        const argVal = actionArgs[i];
        if (argVal !== undefined) input[def.cliMappings.args[i].field] = argVal;
      }
    }

    // Build input from options
    if (def.cliMappings.options) {
      for (const opt of def.cliMappings.options) {
        const camelKey = deriveCamelKey(opt.flags);
        if (camelKey && opts[camelKey] !== undefined) {
          input[opt.field] = opts[camelKey];
        }
      }
    }

    const parsed = def.inputSchema.safeParse(input);
    if (!parsed.success) {
      process.stderr.write(
        JSON.stringify({
          error: parsed.error.issues.map((i) => i.message).join(', '),
          code: 'VALIDATION_ERROR',
        }) + '\n',
      );
      process.exit(1);
    }

    await executeCommand(def, parsed.data, {
      apiKey: globalOpts.apiKey,
      pretty: globalOpts.pretty,
      quiet: globalOpts.quiet,
    });
  });
}

/** Extract camelCase option name from Commander flags string, e.g. '--from-date <d>' → 'fromDate' */
function deriveCamelKey(flags: string): string | undefined {
  const match = flags.match(/--([a-z][a-z0-9-]*)/);
  if (!match) return undefined;
  return match[1].replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}
