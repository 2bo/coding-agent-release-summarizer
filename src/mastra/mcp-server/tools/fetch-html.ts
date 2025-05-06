import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { parse } from 'node-html-parser';

/**
 * HTML取得ツール
 * 指定されたURLからHTMLを取得し、デフォルトでbodyタグの内容のみを返します
 * セレクタを指定することで特定の要素のみを抽出可能
 * fullHtmlをtrueにすると完全なHTMLを取得できます
 */
export const fetchHtmlTool = createTool({
  id: 'fetch_html',
  description:
    'Fetch HTML from a URL and parse it into a DOM structure, returns body content by default',
  inputSchema: z.object({
    url: z.string().url(),
    selector: z.string().optional(), // オプションでCSSセレクタ指定可能
    fullHtml: z.boolean().optional(), // 完全なHTMLを取得するかどうか（デフォルトはfalse）
  }),
  outputSchema: z.object({
    title: z.string(),
    content: z.string(), // デフォルトではbodyの内容
    fullContent: z.string().optional(), // 完全なHTML
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
      const body = root.querySelector('body');

      // セレクタが指定されている場合、その要素を抽出
      let elements;
      if (context.selector) {
        elements = root.querySelectorAll(context.selector);
      } else {
        elements = body ? [body] : [root];
      }

      return {
        title: root.querySelector('title')?.text || '',
        content: body?.innerHTML || html, // デフォルトでbodyの内容を返す
        fullContent: context.fullHtml ? html : undefined, // fullHtmlが指定された場合のみ完全なHTMLを返す
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
