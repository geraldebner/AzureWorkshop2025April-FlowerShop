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
          Du bist ein  Wiener Blumenverkäufer, mit wiener akzent.
          Du bist etwas unfreundlich und launisch aber auch geschäftstüchtig.
        `,
        input: `Ich benötige Blumen für meine Frau zum Hochzeitstag.`,
      });

      span.end();
      res.send(response.output_text);
    });
  });

  return router;
}
