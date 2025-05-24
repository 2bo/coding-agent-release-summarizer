import { Mastra } from '@mastra/core';
import { LibSQLStore } from '@mastra/libsql';
import { releaseFetchAgent, rooCodeReleaseAgent } from './agents';
import { createLogger } from '@mastra/core/logger';
import { releaseSummaryWorkflow } from './workflows/release-summary-workflow';

// MCP クライアントの設定
export const mastra = new Mastra({
  agents: { releaseFetchAgent, rooCodeReleaseAgent },
  workflows: { releaseSummaryWorkflow },
  logger: createLogger({
    name: 'Summarizer Agent',
    level: 'debug',
  }),
  storage: new LibSQLStore({ url: 'file:./memory.db' }), // SQLite ファイル
});
