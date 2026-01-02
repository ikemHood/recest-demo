import { openai } from "@/recast/lib/ai";
import { generateCarouselPdf } from "@/recast/lib/pdf";
import { generateObject } from "ai";
import { z } from "zod";

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const { article } = await req.json() as { article: string };

        if (!article) {
            return new Response("Article content is required", { status: 400 });
        }

        const { object } = await generateObject({
            model: openai("openai/gpt-5.2"),
            schema: z.object({
                linkedInPost: z.string().describe("A professional LinkedIn post with a hook, body with line breaks, and a clear CTA."),
                instagramCaption: z.string().describe("A short, punchy Instagram caption with emojis."),
                slides: z.array(z.string()).describe("5-10 slides for a carousel. Each string is the content of one slide. Keep it concise, big font friendly."),
            }),
            prompt: `Repurpose the following article into a LinkedIn Post, an Instagram Caption, and a LinkedIn Carousel (5-10 slides):\n\n${article}`,
        });

        const pdfBase64 = await generateCarouselPdf(object.slides);

        return Response.json({
            ...object,
            pdfBase64,
        });
    } catch (error) {
        console.error("Error generating content:", error);
        return new Response("Internal Server Error", { status: 500 } as ResponseInit);
    }
}
