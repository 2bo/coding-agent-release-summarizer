import { Mastra } from '@mastra/core';
import { releaseFetchAgent } from './agents/releaseFetchAgent';
import { createLogger } from '@mastra/core/logger';
import { releaseSummaryWorkflow } from './workflows';

// MCP クライアントの設定
export const mastra = new Mastra({
  agents: { releaseFetchAgent },
  workflows: { releaseSummaryWorkflow },
  logger: createLogger({
    name: 'Summarizer Agent',
    level: 'debug',
  }),
});
