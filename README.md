# mcp-notion_connect

Notion MCP Pack

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Notion_connect data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
