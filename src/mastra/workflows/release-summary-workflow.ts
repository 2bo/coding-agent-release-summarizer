import { Workflow, Step } from '@mastra/core';
import { releaseFetchAgent, summarizeAgent } from '../agents';
import { CLINE_URL, ROO_URL } from '../../config/constants';

export const services = [
  { url: CLINE_URL, name: 'Cline', stepId: 'releaseFetchCline' },
  { url: ROO_URL, name: 'Roo Code', stepId: 'releaseFetchRooCode' },
];

const releaseFetchSteps = services.map((service) => {
  return new Step({
    id: service.stepId,
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
          resourceId: service.stepId,
          threadId: `${service.stepId}-${new Date().toISOString().split('T')[0]}`,
        }
      );
      return response.text;
    },
  });
});

const summarizeStep = new Step({
  id: 'summarize',
  execute: async ({ context }) => {
    const results: string[] = [];

    services.forEach((service) => {
      results.push(context.getStepResult<string>(service.stepId));
    });

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

export const releaseSummaryWorkflow = new Workflow({
  name: 'release-summary-workflow',
});

releaseFetchSteps.forEach((step) => {
  releaseSummaryWorkflow.step(step);
});

const fetchStepIds = services.map((service) => service.stepId);
// summarizeステップを追加し、全てのフェッチステップの後に実行されるように設定
releaseSummaryWorkflow.after(fetchStepIds).step(summarizeStep);

releaseSummaryWorkflow.commit();
