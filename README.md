# mcp-notion_connect

Notion MCP Pack

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1877+ live data sources. This is an independent, unofficial integration — not affiliated with, endorsed by, or published by the upstream provider.

## Tools

| Tool | Description |
|------|-------------|
| `notion_search` | Search your Notion workspace by keyword. Returns matching page/database titles, IDs, and types to locate content quickly. |
| `notion_get_page` | Get a Notion page by ID. Returns full properties, metadata, and content structure for reading or editing. |
| `notion_get_database` | Get a Notion database schema by ID. Returns all properties, field types, and configuration to understand structure. |
| `notion_query_database` | Query a Notion database with filters and sorting (e.g., status='Done', sort by date). Returns matching rows with property values. |
| `notion_list_pages` | List all accessible pages in your Notion workspace. Returns titles and IDs to discover available content. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "notion_connect": {
      "url": "https://gateway.pipeworx.io/notion_connect/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/notion_connect/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1877+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

This pack runs against a connected notion account, so it needs a Pipeworx key: sign in at https://pipeworx.io/account, connect notion, then call `POST https://gateway.pipeworx.io/v1/tools/notion_search` with `Authorization: Bearer <your Pipeworx key>`. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/notion_search`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Standalone (no gateway account)

This package also runs as a local stdio MCP server — no Pipeworx account, no
gateway round-trip:

```json
{
  "mcpServers": {
    "notion_connect": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-notion_connect"]
    }
  }
}
```

Or run it directly to confirm it starts:

```bash
npx -y @pipeworx/mcp-notion_connect
```

It speaks MCP over stdin/stdout and answers `initialize`/`tools/list`/`tools/call`
for **only** this pack's tools — none of the shared meta-tools the gateway
connection above adds. Same source, same tools, no ask_pipeworx routing.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Notion_connect data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
