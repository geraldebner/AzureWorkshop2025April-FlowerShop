import { SpanStatusCode, trace } from "@opentelemetry/api";
import express from "express";
import { AzureOpenAI } from "openai";
import KeyVault from "./keyvault";

const deployment = "gpt-4o";
const apiVersion = "2025-03-01-preview";

const tracer = trace.getTracer("openai");

let openaiApiClient: AzureOpenAI | undefined;

export function getOpenaiApi(keyVault: KeyVault) {
  const router = express.Router();

  router.post("/chat", async (req, res) => {
    return await tracer.startActiveSpan("openai.chat", async (span) => {
        const { input }: { input: string } = req.body;
 
      if (!openaiApiClient) {
        const apiKey = await keyVault.getSecret("AZURE-OPENAI-API-KEY");
        openaiApiClient = new AzureOpenAI({
          apiKey,
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
        input,
      });

      span.end();
      res.send(response.output_text);
    });
  });

  router.post("/chatNice", async (req, res) => {
    return await tracer.startActiveSpan("openai.chat", async (span) => {
        const { input }: { input: string } = req.body;
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
          Du bist ein eine nette und sehr zuvorkommende Blumenverkäuferin.
          du erkennst alle wünsche deiner Kunden.
          Du bist ein Fachfrau für Blumen.
        `,
        input,
      });

      span.end();
      res.send(response.output_text);
    });
  });

  return router;
}
