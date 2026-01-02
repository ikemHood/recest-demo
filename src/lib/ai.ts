import { createOpenAI } from "@ai-sdk/openai";
import { env } from "@/recast/env";

export const openai = createOpenAI({
    apiKey: env.OPENAI_API_KEY,
});
