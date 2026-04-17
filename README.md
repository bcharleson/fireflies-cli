# fireflies-cli

Agent-native CLI and MCP server for the [Fireflies.ai](https://fireflies.ai) API. Works as a standard CLI tool or as an MCP server that connects AI agents directly to your meeting intelligence.

## Installation

```bash
npm install -g fireflies-cli
```

## Setup

Get your API key from fireflies.ai → Settings → Integrations → Fireflies API

```bash
fireflies login
# or
export FIREFLIES_API_KEY=your_key_here
```

## Usage

```bash
# Transcripts
fireflies transcripts list --limit 10 --pretty
fireflies transcripts get TRANSCRIPT_ID --pretty
fireflies transcripts list --keyword "product roadmap" --mine

# AskFred AI queries
fireflies askfred ask --query "What were the action items from this week?"
fireflies askfred ask --transcript-id ID --query "Summarize the budget discussion"

# Live meetings
fireflies meetings active
fireflies meetings add-bot --link https://meet.google.com/abc-xyz

# Upload audio for transcription
fireflies upload audio --url https://example.com/recording.mp3 --title "Sales Call"

# Analytics (Business plan + admin)
fireflies analytics get --from 2026-01-01 --pretty
```

## MCP Server

For AI agent integration (Claude Desktop, OpenClaw, Cursor):

```bash
fireflies mcp
```

Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "fireflies": {
      "command": "npx",
      "args": ["fireflies-cli", "mcp"],
      "env": { "FIREFLIES_API_KEY": "your_key_here" }
    }
  }
}
```

See [AGENTS.md](./AGENTS.md) for the full command reference with all 32 tools.

## License

MIT
