import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

/**
 * URL取得ツール
 * 指定されたURLから生のコンテンツを取得します
 */
export const fetchUrlTool = createTool({
  id: 'fetch_url',
  description: 'Fetch raw content from a URL',
  inputSchema: z.object({
    url: z.string().url(),
  }),
  outputSchema: z.object({
    body: z.string(),
  }),
  execute: async ({ context }) => {
    try {
      const response = await fetch(context.url);
      const body = await response.text();
      return { body };
    } catch (error) {
      console.error('Error fetching URL:', error);
      return { body: '' };
    }
  },
});
