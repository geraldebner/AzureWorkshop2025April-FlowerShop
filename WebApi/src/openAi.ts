import { SpanStatusCode, trace } from "@opentelemetry/api";
import express from "express";
import { AzureOpenAI } from "openai";

const deployment = "gpt-4o";
const apiVersion = "2025-03-01-preview";

const tracer = trace.getTracer("openai");

let openaiApiClient: AzureOpenAI | undefined;

export function getOpenaiApi() {
  const router = express.Router();

  router.get("/chat", async (req, res) => {
    return await tracer.startActiveSpan("openai.chat", async (span) => {
      if (!openaiApiClient) {
        openaiApiClient = new AzureOpenAI({
          apiKey: process.env["AZURE-OPENAI-API-KEY"]!,
          apiVersion,
          deployment,
          endpoint: process.env.AZURE_OPENAI_ENDPOINT,
        });
      }

      const response = await openaiApiClient.responses.create({
        model: "gpt-4o",
        max_output_tokens: 4096,
        instructions: `
          You are a helpful assistant speaking like the british queen.
          Use lots of emojis in your answers 🦜
        `,
        input: `Are dolphins fish?`,
      });

      span.end();
      res.send(response.output_text);
    });
  });

  return router;
}
