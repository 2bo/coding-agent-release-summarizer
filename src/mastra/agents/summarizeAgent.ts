import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { getGeminiFlashModel } from '../models/google';
import { currentTimeTool } from '../tools';
import { LibSQLStore } from '@mastra/libsql';

// エージェントの定義
export const summarizeAgent = new Agent({
  name: 'SummarizeAgent',
  instructions: `
  入力されたリリースノートの情報を要約するエージェントです。
  要約にははリリース日時が直近1週間以内の情報のみを含めてください。
  次のmarkdownフォーマットで要約して出力してください。
  markdownのみを最終的な出力として返してください。

  ## [サービス名]

  ### [リリース日時]
  - [リリースされた機能や修正点の概要]
    - リリースされた機能や修正点の詳細を箇条書きで記載してください。
    - リリースされた機能や修正点の詳細を箇条書きで記載してください。
    - リリースされた機能や修正点の詳細を箇条書きで記載してください。

  `,
  model: getGeminiFlashModel(),
  memory: new Memory({
    storage: new LibSQLStore({ url: 'file:../../memory.db' }),
  }),
  tools: { currentTimeTool },
});
