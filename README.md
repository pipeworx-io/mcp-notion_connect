# mcp-notion_connect

Notion MCP Pack

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `notion_search` | Search pages and databases in the Notion workspace. Returns matching results with titles and IDs. |
| `notion_get_page` | Get a Notion page by ID. Returns page properties and metadata. |
| `notion_get_database` | Get a Notion database by ID. Returns database schema, properties, and metadata. |
| `notion_query_database` | Query a Notion database with optional filters and sorts. Returns matching pages/rows. |
| `notion_list_pages` | List all pages the Notion integration has access to. Uses search with page filter. |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "notion_connect": {
      "url": "https://gateway.pipeworx.io/notion_connect/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use notion_connect
```

## License

MIT
