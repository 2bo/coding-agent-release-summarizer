#!/usr/bin/env node

import { MCPServer } from '@mastra/mcp';
// import { fetchRssTool } from './tools/fetch-rss';
// import { fetchHtmlTool } from './tools/fetch-html';
import { fetchMarkdownTool } from './tools/fetch-markdown';

// MCP サーバー設定
const server = new MCPServer({
  name: 'Fetch MCP Server',
  version: '1.0.0',
  tools: {
    // fetchRssTool,
    // fetchHtmlTool,
    fetchMarkdownTool,
  },
});

// stdioトランスポートでサーバーを起動
server.startStdio().catch((err) => {
  console.error('Error starting MCP server:', err);
  process.exit(1);
});
