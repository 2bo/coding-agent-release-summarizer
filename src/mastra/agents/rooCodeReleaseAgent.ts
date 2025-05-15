import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { getGeminiFlashModel } from '../models/google';
import { playwrightClient } from '../mcp-client/playwright-client';
import { currentTimeTool } from '../tools';

// RooCodeのリリース情報を取得するエージェントの定義
export const rooCodeReleaseAgent = new Agent({
  name: 'RooCodeReleaseAgent',
  instructions: `
  このエージェントはRoo Codeのリリース情報を取得するためのものです。
  Playwright MCP Serverを使用して、(https://www.google.com)でRoo Codeのリリース情報を検索してください。
  検索結果の中から、リンクを開いて、公式なリリースノートページを見つけて、リリース情報を取得します。
  
  現在の日付と照らし合わせて直近1週間のリリース情報のみを抽出して日本語で要約してください。
  例えば、今日が5月15日であれば、5月8日から5月15日までのリリース情報を抽出します。
  対象期間外の情報は無視してください。
  
  直近1週間以内にリリースされた情報がない場合は、「直近1週間以内にリリースされたRoo Codeの情報はありません」と出力してください。
  
  取得した情報は以下の形式で整理してください:
  - リリースバージョン
  - リリース日時
  - 主な変更点および新機能
  - バグ修正
  
  すべての情報を日本語で要約して返してください。
  `,
  model: getGeminiFlashModel(),
  memory: new Memory(),
  tools: { ...(await playwrightClient.getTools()), currentTimeTool },
});
