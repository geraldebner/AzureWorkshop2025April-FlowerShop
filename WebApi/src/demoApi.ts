import { SpanStatusCode, trace } from "@opentelemetry/api";
import express from "express";

const router = express.Router();
const tracer = trace.getTracer("demo-api");

router.get("/logging", (req, res) => {
  tracer.startActiveSpan("logging", (span) => {
    span.addEvent("logging", { message: "Hello World" });
    span.setAttribute("logging.user", "Kaiser Franz");
    res.send("Hello World");
    span.end();
  });
});

router.get("/exception", (req, res) => {
  tracer.startActiveSpan("exception", (span) => {
    try {
      // Placeholder for real code that throws an exception
      throw new Error("This is a test exception");
    } catch (error: any) {
      span.recordException({ code: 'TEST_ERROR', message: error.message });
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw error;
    } finally {
      span.end();
    }
  });
});

export default router;
