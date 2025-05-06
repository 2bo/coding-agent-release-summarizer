/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Workflow, Step } from '@mastra/core';
import { releaseFetchAgent, summarizeAgent } from '../agents';
import { CLINE_URL, ROO_URL } from '../../config/constants';

export const services = [
  { url: CLINE_URL, name: 'Cline', id: 'cline' },
  { url: ROO_URL, name: 'Roo Code', id: 'roo' },
];

// URLs配列から複数のステップを生成する
const releaseFetchSteps = services.map((service, index) => {
  return new Step({
    id: `releaseFetch${service.id}`,
    execute: async (_context) => {
      const response = await releaseFetchAgent.generate(
        [
          {
            role: 'user',
            content: `${service.url} から ${service.name} のリリース情報を取得してください。`,
          },
        ],
        {
          maxSteps: 10,
          resourceId: `releaseFetch${index}`,
          threadId: `${service.id}-${new Date().toISOString().split('T')[0]}`,
        }
      );
      return response.text;
    },
  });
});

const summarizeStep = new Step({
  id: 'summarize',
  execute: async ({ context }) => {
    const results = [];

    // resultsに各ステップの結果を追加
    results.push(context.getStepResult<string>('releaseFetchcline'));
    results.push(context.getStepResult<string>('releaseFetchroo'));

    const response = await summarizeAgent.generate(
      [
        {
          role: 'user',
          content: `以下のリリース情報を要約してください。\n\n${results.join('\n\n')}`,
        },
      ],
      {
        maxSteps: 10,
        resourceId: 'summarize',
        threadId: `summary-${new Date().toISOString().split('T')[0]}`,
      }
    );
    return response.text;
  },
});

// リリース情報の収集と要約を行うワークフロー
export const releaseSummaryWorkflow = new Workflow({
  name: 'release-summary-workflow',
});

releaseFetchSteps.forEach((step) => {
  releaseSummaryWorkflow.step(step);
});

// 全てのフェッチステップのIDを取得
const fetchStepIds = services.map(service => `releaseFetch${service.id}`);

// summarizeステップを追加し、全てのフェッチステップの後に実行されるように設定
releaseSummaryWorkflow.after(fetchStepIds).step(summarizeStep);

// ワークフローをコミット
releaseSummaryWorkflow.commit();
