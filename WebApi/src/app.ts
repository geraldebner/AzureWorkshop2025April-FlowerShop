import dotenv from "dotenv";
dotenv.config();

import { addTelemetry } from "./telemetry";
addTelemetry();

import express from "express";
const app = express();

app.get("/king", (req, res) => {
  res.send("kong");
});

const PORT = parseInt(process.env.PORT || "8080");
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
