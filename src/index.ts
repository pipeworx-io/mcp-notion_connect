interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Notion MCP Pack
 *
 * Requires OAuth connection — gateway injects credentials via _context.notion.
 * Tools: search, get page, get database, query database, list pages.
 */


interface NotionContext {
  notion?: { accessToken: string };
}

const BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

async function notionFetch(ctx: NotionContext, path: string, method = 'GET', body?: unknown) {
  if (!ctx.notion) {
    return { error: 'connection_required', message: 'Connect your Notion account at https://pipeworx.io/account' };
  }
  const { accessToken } = ctx.notion;
  const opts: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
  };
  if (body && method !== 'GET') {
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(`${BASE}${path}`, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Notion API error (${res.status}): ${text}`);
  }
  return res.json();
}

const tools: McpToolExport['tools'] = [
  {
    name: 'notion_search',
    description: 'Search pages and databases in the Notion workspace. Returns matching results with titles and IDs.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Search query text' },
        filter: { type: 'string', description: 'Filter by object type: "page" or "database" (optional)' },
        page_size: { type: 'number', description: 'Number of results to return (default 10, max 100)' },
        start_cursor: { type: 'string', description: 'Pagination cursor for next page of results' },
      },
    },
  },
  {
    name: 'notion_get_page',
    description: 'Get a Notion page by ID. Returns page properties and metadata.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        page_id: { type: 'string', description: 'Notion page ID (UUID format, with or without dashes)' },
      },
      required: ['page_id'],
    },
  },
  {
    name: 'notion_get_database',
    description: 'Get a Notion database by ID. Returns database schema, properties, and metadata.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        database_id: { type: 'string', description: 'Notion database ID (UUID format, with or without dashes)' },
      },
      required: ['database_id'],
    },
  },
  {
    name: 'notion_query_database',
    description: 'Query a Notion database with optional filters and sorts. Returns matching pages/rows.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        database_id: { type: 'string', description: 'Notion database ID to query' },
        filter: { type: 'object', description: 'Notion filter object (e.g., { "property": "Status", "select": { "equals": "Done" } })' },
        sorts: { type: 'array', description: 'Array of sort objects (e.g., [{ "property": "Created", "direction": "descending" }])' },
        page_size: { type: 'number', description: 'Number of results to return (default 10, max 100)' },
        start_cursor: { type: 'string', description: 'Pagination cursor for next page of results' },
      },
      required: ['database_id'],
    },
  },
  {
    name: 'notion_list_pages',
    description: 'List all pages the Notion integration has access to. Uses search with page filter.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        page_size: { type: 'number', description: 'Number of results to return (default 10, max 100)' },
        start_cursor: { type: 'string', description: 'Pagination cursor for next page of results' },
      },
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const context = (args._context ?? {}) as NotionContext;
  delete args._context;

  switch (name) {
    case 'notion_search': {
      const body: Record<string, unknown> = {};
      if (args.query) body.query = args.query;
      if (args.filter) body.filter = { value: args.filter, property: 'object' };
      if (args.page_size) body.page_size = args.page_size;
      if (args.start_cursor) body.start_cursor = args.start_cursor;
      return notionFetch(context, '/search', 'POST', body);
    }
    case 'notion_get_page':
      return notionFetch(context, `/pages/${args.page_id}`);
    case 'notion_get_database':
      return notionFetch(context, `/databases/${args.database_id}`);
    case 'notion_query_database': {
      const body: Record<string, unknown> = {};
      if (args.filter) body.filter = args.filter;
      if (args.sorts) body.sorts = args.sorts;
      if (args.page_size) body.page_size = args.page_size;
      if (args.start_cursor) body.start_cursor = args.start_cursor;
      return notionFetch(context, `/databases/${args.database_id}/query`, 'POST', body);
    }
    case 'notion_list_pages': {
      const body: Record<string, unknown> = {
        filter: { value: 'page', property: 'object' },
      };
      if (args.page_size) body.page_size = args.page_size;
      if (args.start_cursor) body.start_cursor = args.start_cursor;
      return notionFetch(context, '/search', 'POST', body);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 10 }, provider: 'notion' } satisfies McpToolExport;
