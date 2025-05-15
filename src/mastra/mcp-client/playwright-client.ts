import { MCPClient } from '@mastra/mcp';

export const playwrightClient = new MCPClient({
  servers: {
    playwright: {
      command: 'npx',
      args: ['@playwright/mcp@latest'],
    },
  },
});
