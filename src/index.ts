import { Command } from 'commander';
import { registerAllCommands } from './commands/index.js';
import { startMcpServer } from './mcp/server.js';

const program = new Command();

program
  .name('fireflies')
  .description('Agent-native CLI and MCP server for the Fireflies.ai API')
  .version('0.1.0')
  .option('--api-key <key>', 'Fireflies API key (overrides FIREFLIES_API_KEY env and config)')
  .option('--pretty', 'Pretty-print JSON output')
  .option('--quiet', 'Suppress output (exit code only)');

registerAllCommands(program);

program
  .command('mcp')
  .description('Start the Fireflies MCP server for AI agent integration (stdio transport)')
  .addHelpText(
    'after',
    `
Examples:
  fireflies mcp
  FIREFLIES_API_KEY=xxx fireflies mcp

MCP configuration (Claude Desktop / claude_desktop_config.json):
  {
    "mcpServers": {
      "fireflies": {
        "command": "npx",
        "args": ["fireflies-cli", "mcp"],
        "env": { "FIREFLIES_API_KEY": "your_key_here" }
      }
    }
  }

OpenClaw agent config:
  {
    "mcp": {
      "servers": {
        "fireflies": {
          "command": "npx",
          "args": ["fireflies-cli", "mcp"],
          "env": { "FIREFLIES_API_KEY": "your_key_here" }
        }
      }
    }
  }
`,
  )
  .action(async () => {
    await startMcpServer();
  });

program.parse(process.argv);
