# Fireflies CLI — Agent Reference

Agent-native CLI and MCP server for the [Fireflies.ai](https://fireflies.ai) API. Gives AI agents full access to meeting transcripts, AI summaries, AskFred natural-language queries, soundbites, live meeting bots, and workspace analytics.

---

## Quick Start

```bash
npm install -g fireflies-cli

# Option 1: Environment variable
export FIREFLIES_API_KEY=your_key_here

# Option 2: Interactive login
fireflies login

# Verify auth
fireflies status

# Start MCP server
fireflies mcp
```

Get your API key: fireflies.ai → Settings → Integrations → Fireflies API

---

## Authentication

Three-tier resolution (highest priority first):

| Priority | Method | How |
|---|---|---|
| 1 | `--api-key` flag | `fireflies transcripts list --api-key xxx` |
| 2 | Environment variable | `export FIREFLIES_API_KEY=xxx` |
| 3 | Config file | `fireflies login` (stores in `~/.fireflies-cli/config.json`) |

---

## MCP Server Setup

### Claude Desktop (`~/Library/Application Support/Claude/claude_desktop_config.json`)

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

### OpenClaw Agent Config

```json
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
```

### Cursor / Claude Code

```bash
claude mcp add fireflies -- npx fireflies-cli mcp
# Set env: FIREFLIES_API_KEY=your_key_here
```

---

## Global Flags

All commands support:

| Flag | Description |
|---|---|
| `--api-key <key>` | API key (overrides env/config) |
| `--pretty` | Pretty-print JSON output |
| `--quiet` | Suppress output (exit code only) |

---

## Output Format

All output is JSON on stdout. Errors are JSON on stderr:

```json
{ "error": "Invalid API key. Run: fireflies login", "code": "AUTH_ERROR" }
```

Error codes: `AUTH_ERROR`, `GRAPHQL_ERROR`, `RATE_LIMIT`, `NOT_FOUND`, `VALIDATION_ERROR`, `SERVER_ERROR`

---

## API Notes

- **GraphQL endpoint:** `https://api.fireflies.ai/graphql` (all requests are POST)
- **Rate limits:** Free/Pro: 50 req/day · Business/Enterprise: 60 req/min
- **Special limits:** `meetings add-bot`: 3 req/20min · `transcripts delete`: 10 req/min · `transcripts share`: 10 req/hr
- **Analytics:** Requires Business plan + admin role
- **AskFred:** Natural language queries across meetings — great for agent workflows

---

## All 32 Commands

### auth (3 commands)

| MCP Tool | CLI Command | Description |
|---|---|---|
| `auth_login` | `fireflies login` | Save API key to local config |
| `auth_logout` | `fireflies logout` | Remove stored credentials |
| `auth_status` | `fireflies status` | Show auth source + user profile |

### transcripts (7 commands)

| MCP Tool | CLI Command | Description |
|---|---|---|
| `transcripts_list` | `fireflies transcripts list` | Paginated list with keyword/date/host filters |
| `transcripts_get` | `fireflies transcripts get <id>` | Full transcript: sentences, AI summary, speakers |
| `transcripts_delete` | `fireflies transcripts delete <id>` | Delete a transcript |
| `transcripts_update_title` | `fireflies transcripts update-title <id>` | Rename a meeting |
| `transcripts_update_privacy` | `fireflies transcripts update-privacy <id>` | Set access level |
| `transcripts_share` | `fireflies transcripts share <id>` | Share with email list |
| `transcripts_revoke` | `fireflies transcripts revoke <id>` | Revoke a user's access |

### meetings (3 commands)

| MCP Tool | CLI Command | Description |
|---|---|---|
| `meetings_active` | `fireflies meetings active` | List currently live meetings |
| `meetings_add_bot` | `fireflies meetings add-bot` | Add Fireflies bot to a live meeting |
| `meetings_set_channel` | `fireflies meetings set-channel` | Assign transcript(s) to a channel |

### upload (3 commands)

| MCP Tool | CLI Command | Description |
|---|---|---|
| `upload_audio` | `fireflies upload audio` | Upload audio/video URL for transcription |
| `upload_create_url` | `fireflies upload create-url` | Get pre-signed upload URL |
| `upload_confirm` | `fireflies upload confirm` | Confirm upload and start transcription |

### askfred (5 commands) ★ High agent value

| MCP Tool | CLI Command | Description |
|---|---|---|
| `askfred_list` | `fireflies askfred list` | List all AskFred conversation threads |
| `askfred_get` | `fireflies askfred get <id>` | Get thread with full message history |
| `askfred_ask` | `fireflies askfred ask` | Start new AI conversation about meetings |
| `askfred_reply` | `fireflies askfred reply <id>` | Continue an existing thread |
| `askfred_delete` | `fireflies askfred delete <id>` | Delete a thread |

### bites (3 commands)

| MCP Tool | CLI Command | Description |
|---|---|---|
| `bites_list` | `fireflies bites list` | List soundbite clips |
| `bites_get` | `fireflies bites get <id>` | Get a single soundbite |
| `bites_create` | `fireflies bites create` | Create soundbite from transcript |

### users (3 commands)

| MCP Tool | CLI Command | Description |
|---|---|---|
| `users_me` | `fireflies users me` | Get own user profile |
| `users_list` | `fireflies users list` | List team members |
| `users_set_role` | `fireflies users set-role` | Assign role to user (admin only) |

### channels (2 commands)

| MCP Tool | CLI Command | Description |
|---|---|---|
| `channels_list` | `fireflies channels list` | List all accessible channels |
| `channels_get` | `fireflies channels get <id>` | Get channel by ID |

### analytics (1 command)

| MCP Tool | CLI Command | Description |
|---|---|---|
| `analytics_get` | `fireflies analytics get` | Team + per-user stats (Business plan, admin) |

### apps (1 command)

| MCP Tool | CLI Command | Description |
|---|---|---|
| `apps_list` | `fireflies apps list` | List AI App outputs for meetings |

### groups (1 command)

| MCP Tool | CLI Command | Description |
|---|---|---|
| `groups_list` | `fireflies groups list` | List workspace user groups |

---

## Agent Usage Examples

### Find action items from recent meetings

```bash
# List recent meetings
fireflies transcripts list --limit 5 --pretty

# Get full transcript with AI summary
fireflies transcripts get TRANSCRIPT_ID --summary-only --pretty

# Ask AskFred about action items
fireflies askfred ask --query "What are all the action items from this week's meetings?"
```

### Monitor live meetings

```bash
# Check for active recordings
fireflies meetings active --pretty

# Add bot to a new meeting
fireflies meetings add-bot --link https://meet.google.com/abc-def-ghi --title "Client Call"
```

### Upload and transcribe a recording

```bash
# Upload from URL
fireflies upload audio --url https://example.com/recording.mp3 --title "Sales Call"

# Or get a pre-signed URL for direct upload
fireflies upload create-url --pretty
# → { "url": "https://...", "transcript_id": "abc123" }
# Then PUT your file to that URL, then:
fireflies upload confirm --session-id abc123
```

### Team analytics

```bash
# Current quarter stats
fireflies analytics get --from 2026-01-01 --to 2026-03-31 --pretty
```

### AskFred — natural language meeting queries (best for agents)

```bash
# Ask about a specific meeting
fireflies askfred ask --transcript-id abc123 --query "What did Bob say about the timeline?"

# Ask across all meetings
fireflies askfred ask --query "Summarize all product roadmap discussions this month"

# Follow up in a thread
fireflies askfred reply THREAD_ID -q "Who is responsible for the API redesign?"
```

---

## Concept Glossary

| Term | Description |
|---|---|
| **Transcript** | A recorded and transcribed meeting with speakers, sentences, and AI summary |
| **AskFred** | Fireflies' AI assistant for natural-language queries across meeting data |
| **Soundbite** | A clipped segment of a transcript (start/end timestamps) |
| **Channel** | A workspace grouping for organizing meetings |
| **AI App** | Custom prompts configured in Fireflies that run across meetings |
| **Bot** | The Fireflies notetaker that joins and records live meetings |
| **User Group** | A team organizational unit for access control |
