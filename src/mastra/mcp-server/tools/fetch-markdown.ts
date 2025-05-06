import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import TurndownService from 'turndown';
import { parse } from 'node-html-parser';

/**
 * Markdown取得ツール
 * 指定されたURLからHTMLを取得し、Markdownに変換して返します
 * セレクタを指定することで特定の要素のみを抽出可能
 * オプションでTurndownの設定をカスタマイズ可能
 */
export const fetchMarkdownTool = createTool({
  id: 'fetch_markdown',
  description: 'Fetch HTML from a URL and convert it to Markdown format',
  inputSchema: z.object({
    url: z.string().url(),
    selector: z.string().optional(), // オプションでCSSセレクタ指定可能
    turndownOptions: z
      .object({
        headingStyle: z.enum(['setext', 'atx']).optional(),
        hr: z.string().optional(),
        bulletListMarker: z.enum(['*', '-', '+']).optional(),
        codeBlockStyle: z.enum(['indented', 'fenced']).optional(),
        fence: z.enum(['```', '~~~']).optional(),
        emDelimiter: z.enum(['_', '*']).optional(),
        strongDelimiter: z.enum(['**', '__']).optional(),
        linkStyle: z.enum(['inlined', 'referenced']).optional(),
        linkReferenceStyle: z.enum(['full', 'collapsed', 'shortcut']).optional(),
      })
      .optional(),
  }),
  outputSchema: z.object({
    title: z.string(),
    markdown: z.string(),
    sourceUrl: z.string(),
  }),
  execute: async ({ context }) => {
    try {
      // URLからHTMLを取得
      const response = await fetch(context.url);
      const html = await response.text();
      const root = parse(html);

      // タイトル取得
      const title = root.querySelector('title')?.text || '';

      // コンテンツ取得 (セレクタが指定されていればそれを使用)
      let contentHtml = '';
      if (context.selector) {
        const selectedElements = root.querySelectorAll(context.selector);
        contentHtml = selectedElements.map((el) => el.outerHTML).join('\\n');
      } else {
        // デフォルトはbodyの内容
        contentHtml = root.querySelector('body')?.innerHTML || html;
      }

      // Turndownの設定
      const turndownService = new TurndownService(
        context.turndownOptions || {
          headingStyle: 'atx',
          codeBlockStyle: 'fenced',
          fence: '```',
          bulletListMarker: '-',
          emDelimiter: '*',
          strongDelimiter: '**',
        }
      );

      // HTML to Markdown変換
      const markdown = turndownService.turndown(contentHtml);

      return {
        title,
        markdown,
        sourceUrl: context.url,
      };
    } catch (error) {
      console.error('Error fetching Markdown:', error);
      return {
        title: '',
        markdown: `Error fetching content from ${context.url}: ${error}`,
        sourceUrl: context.url,
      };
    }
  },
});
