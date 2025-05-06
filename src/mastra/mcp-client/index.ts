import { MCPClient } from '@mastra/mcp';

export const mcpClient = new MCPClient({
  servers: {
    myServer: {
      command: 'npx',
      args: ['tsx', '../../dist/index.js'],
    },
  },
});
