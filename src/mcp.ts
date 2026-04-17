import { startMcpServer } from './mcp/server.js';

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));

startMcpServer().catch((error: unknown) => {
  const msg = error instanceof Error ? error.message : String(error);
  process.stderr.write(JSON.stringify({ error: msg, code: 'STARTUP_ERROR' }) + '\n');
  process.exit(1);
});
