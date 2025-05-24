import { releaseFetchAgent, summarizeAgent } from '../agents';
import { CLINE_URL, ROO_URL } from '../../config/constants';
import { createStep, createWorkflow } from '@mastra/core';
import { z } from 'zod';

export const services = [
  { url: CLINE_URL, name: 'Cline', stepId: 'releaseFetchCline' },
  { url: ROO_URL, name: 'Roo Code', stepId: 'releaseFetchRooCode' },
];

const releaseFetchSteps = services.map((service) =>
  createStep({
    id: service.stepId,
    description: `${service.name} のリリース情報を取得`,
    inputSchema: z.void(),
    outputSchema: z.string(),
    async execute(_context: any) {
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
  })
);
const fetchResultsSchema = z.object(
  Object.fromEntries(services.map((s) => [s.stepId, z.string()])) as Record<string, z.ZodString>
);

const summarizeStep = createStep({
  id: 'summarize',
  description: '全サービスのリリース情報を要約',
  inputSchema: fetchResultsSchema,
  outputSchema: z.string(),
  async execute({ inputData }) {
    const merged = Object.values(inputData).join('\n\n');
    const resp = await summarizeAgent.generate(
      [{ role: 'user', content: `以下のリリース情報を要約してください。\n\n${merged}` }],
      {
        maxSteps: 10,
        resourceId: 'summarize',
        threadId: `summarize-${new Date().toISOString().split('T')[0]}`, // ★追加
      }
    );
    return resp.text;
  },
});

export const releaseSummaryWorkflow = createWorkflow({
  id: 'release-summary-workflow',
  inputSchema: z.void(),
  outputSchema: z.string(),
  steps: [...releaseFetchSteps, summarizeStep],
});

releaseSummaryWorkflow.parallel(releaseFetchSteps).then(summarizeStep);
releaseSummaryWorkflow.commit();
