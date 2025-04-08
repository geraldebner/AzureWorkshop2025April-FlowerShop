import dotenv from "dotenv";
dotenv.config();

import { addTelemetry } from "./telemetry.js";
addTelemetry();


import express from "express";
const app = express();
app.use(express.json());

import KeyVault from "./keyvault.js";
const keyVault = new KeyVault();

import demoApi from "./demoApi.js";
app.use("/", demoApi);

import { getOpenaiApi } from "./openAi.js";
app.use("/", getOpenaiApi(keyVault));

import {postRabate} from "./rabate.js";
app.use("/", postRabate());




// just to TEST --> NEVER EVER in PRODUCTION
app.get("/secret", async (req, res) => {
  const secret = await keyVault.getSecret("AZURE-OPENAI-API-KEY");
  res.json({ secret });
});

const PORT = parseInt(process.env.PORT || "8080");
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
