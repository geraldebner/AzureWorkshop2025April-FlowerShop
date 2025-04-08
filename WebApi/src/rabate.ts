import { SpanStatusCode, trace } from "@opentelemetry/api";
import express from "express";

const router = express.Router();
const tracer = trace.getTracer("rabate");

export function postRabate() {
  const router = express.Router();

  router.post("/rabate", async (req, res) => {
    const { input }: { input: string } = req.body;
 
    let price = parseInt(input);

    // calulate the discount
    let discountPercent = 0.05;
    if (price < 20) {
      discountPercent = 0;
    }
    else if (price < 50) {
      discountPercent = 0.03;
    }

    let discountedPrice = price - (price * discountPercent);

    res.send(`Der Preis ist ${discountedPrice} Euro`);

  });

  
  return router;
}
