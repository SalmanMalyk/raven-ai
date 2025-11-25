import { ChatAnthropic } from "@langchain/anthropic";

export const model = new ChatAnthropic({
  model: process.env.ANTHROPIC_MODEL,
  apiKey: process.env.ANTHROPIC_API_KEY,
  temperature: 0.7,
});