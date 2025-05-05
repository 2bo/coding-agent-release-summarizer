import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { parse } from 'node-html-parser';

/**
 * HTML取得ツール
 * 指定されたURLからHTMLを取得し、DOM構造に解析します
 * セレクタを指定することで特定の要素のみを抽出可能
 */
export const fetchHtmlTool = createTool({
  id: 'fetch_html',
  description: 'Fetch HTML from a URL and parse it into a DOM structure',
  inputSchema: z.object({
    url: z.string().url(),
    selector: z.string().optional(), // オプションでCSSセレクタ指定可能
  }),
  outputSchema: z.object({
    title: z.string(),
    content: z.string(),
    elements: z
      .array(
        z.object({
          tag: z.string(),
          text: z.string(),
          html: z.string(),
        })
      )
      .optional(),
  }),
  execute: async ({ context }) => {
    try {
      const response = await fetch(context.url);
      const html = await response.text();
      const root = parse(html);

      // セレクタが指定されている場合は絞り込む
      const elements = context.selector ? root.querySelectorAll(context.selector) : [root];

      return {
        title: root.querySelector('title')?.text || '',
        content: html,
        elements: elements.map((el) => ({
          tag: el.tagName,
          text: el.text,
          html: el.innerHTML,
        })),
      };
    } catch (error) {
      console.error('Error fetching HTML:', error);
      return { title: '', content: '', elements: [] };
    }
  },
});
