import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { resolveApiKey } from '../core/auth.js';
import { createClient, type FirefliesClient } from '../core/client.js';
import { formatError } from '../core/errors.js';

export async function startMcpServer(): Promise<void> {
  // Defer import to avoid circular deps at startup
  const { allCommands } = await import('../commands/index.js');

  const server = new McpServer({
    name: 'fireflies',
    version: '0.1.0',
  });

  // Resolve credentials once at startup
  let client: FirefliesClient;
  try {
    const { apiKey } = await resolveApiKey();
    client = createClient(apiKey);
  } catch (err) {
    process.stderr.write(
      JSON.stringify({
        error: err instanceof Error ? err.message : String(err),
        code: 'AUTH_ERROR',
        hint: 'Set FIREFLIES_API_KEY env var or run: fireflies login',
      }) + '\n',
    );
    process.exit(1);
  }

  // Register all commands as MCP tools
  for (const def of allCommands) {
    if (def.name === 'mcp_start') continue;

    // Cast shape to any to avoid deep generic recursion with MCP SDK types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    server.tool(
      def.name,
      def.description,
      def.inputSchema.shape as any,
      async (args: Record<string, unknown>) => {
        try {
          const parsed = def.inputSchema.safeParse(args);
          if (!parsed.success) {
            return {
              content: [
                {
                  type: 'text' as const,
                  text: JSON.stringify({
                    error: parsed.error.issues.map((i) => i.message).join(', '),
                    code: 'VALIDATION_ERROR',
                  }),
                },
              ],
              isError: true,
            };
          }

          const result = await def.handler(parsed.data, client);
          return {
            content: [{ type: 'text' as const, text: JSON.stringify(result) }],
          };
        } catch (err) {
          return {
            content: [{ type: 'text' as const, text: JSON.stringify(formatError(err)) }],
            isError: true,
          };
        }
      },
    );
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
