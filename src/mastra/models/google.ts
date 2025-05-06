import { createGoogleGenerativeAI } from '@ai-sdk/google';

// GoogleGenerativeAIのインスタンスを作成
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

// 様々なモデル初期化関数をエクスポート
export function getGeminiFlashModel() {
  return google('gemini-2.0-flash-001');
}

export default google;
