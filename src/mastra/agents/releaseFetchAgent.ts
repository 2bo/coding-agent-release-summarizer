import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { getGeminiFlashModel } from '../models/google';
import { mcpClient } from '../mcp-client';
import { currentTimeTool } from '../tools';
import { LibSQLStore } from '@mastra/libsql';

// エージェントの定義
export const releaseFetchAgent = new Agent({
  name: 'ReleaseFetchAgent',
  instructions: `指定されたリリースノートページのURLからリリース情報を取得するエージェントです。 
  MCP クライアントを使用して、リリース情報を取得しします。
  取得した情報を確認し、現在の日付と照らし合わせて直近1週間のリリース情報のみを抽出して日本語で要約します。
  例えば、今日が5月15日であれば、5月8日から5月15日までのリリース情報を抽出します。対象期間外の情報は無視してください。
  直近1週間以内にリリースされた情報がない場合は、直近1週間以内にリリースされた情報はありませんと出力してください。
  `,
  model: getGeminiFlashModel(),
  memory: new Memory({
    storage: new LibSQLStore({ url: 'file:../../memory.db' }),
  }),
  tools: { ...(await mcpClient.getTools()), currentTimeTool },
});
