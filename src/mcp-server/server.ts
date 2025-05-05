import { MCPServer } from '@mastra/mcp';
import { fetchRssTool } from './tools/fetch-rss';
import { fetchHtmlTool } from './tools/fetch-html';
import { fetchUrlTool } from './tools/fetch-url';

// ツールをオブジェクトとして定義
const tools = {
  fetchRssTool,
  fetchHtmlTool,
  fetchUrlTool,
};

// MCP サーバー設定
const server = new MCPServer({
  name: 'Fetch MCP Server',
  version: '1.0.0',
  tools, // オブジェクトとして提供
});

// stdioトランスポートでサーバーを起動
server.startStdio().catch((err) => {
  console.error('Error starting MCP server:', err);
  process.exit(1);
});

// テストやプログラム的な起動のためにエクスポート
export { server };
