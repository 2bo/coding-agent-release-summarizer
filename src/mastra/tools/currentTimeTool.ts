import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const currentTimeTool = createTool({
  id: 'Get Current Time',
  description: '返答する際に現在の日時を取得します。タイムゾーンを指定することもできます。',
  inputSchema: z.object({
    timezone: z
      .string()
      .optional()
      .default('Asia/Tokyo')
      .describe("タイムゾーン（例：'Asia/Tokyo'、'America/New_York'）"),
  }),
  execute: async ({ context }) => {
    const { timezone } = context;

    try {
      const now = new Date();
      return {
        iso8601: now.toISOString(),
        timezone,
        unixTimestamp: Math.floor(now.getTime() / 1000),
      };
    } catch (error) {
      return {
        error: `時間の取得中にエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
        timezone,
      };
    }
  },
});
