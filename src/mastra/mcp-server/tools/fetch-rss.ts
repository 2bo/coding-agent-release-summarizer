import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import Parser from 'rss-parser';

/**
 * RSS取得ツール
 * 指定されたURLからRSSフィードを取得して解析します
 */
export const fetchRssTool = createTool({
  id: 'fetch_rss',
  description: 'Fetch and parse a RSS feed',
  inputSchema: z.object({
    url: z.string().url(),
  }),
  outputSchema: z.object({
    items: z.array(
      z.object({
        title: z.string(),
        link: z.string().optional(),
        content: z.string().optional(),
        contentSnippet: z.string().optional(),
        pubDate: z.string().optional(),
        isoDate: z.string().optional(),
      })
    ),
  }),
  execute: async ({ context }) => {
    try {
      const parser = new Parser();
      const feed = await parser.parseURL(context.url);

      // フィードアイテムを適切にマッピングして型の互換性を確保
      const mappedItems = feed.items.map((item) => ({
        title: item.title || 'no title', // titleがundefinedの場合はデフォルト値を設定
        link: item.link,
        content: item.content,
        contentSnippet: item.contentSnippet,
        pubDate: item.pubDate,
        isoDate: item.isoDate,
      }));

      return { items: mappedItems };
    } catch (error) {
      console.error('Error fetching RSS:', error);
      return { items: [] };
    }
  },
});
