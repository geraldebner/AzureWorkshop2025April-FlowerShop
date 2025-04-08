import dotenv from "dotenv";
dotenv.config();

import { addTelemetry } from "./telemetry.js";
addTelemetry();

import express from "express";
const app = express();
app.use(express.json());

import demoApi from "./demoApi.js";
app.use("/", demoApi);

import { getOpenaiApi } from "./openAi.js";
app.use("/", getOpenaiApi());

import {postRabate} from "./rabate.js";
app.use("/", postRabate());

const PORT = parseInt(process.env.PORT || "8080");
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
