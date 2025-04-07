import express from "express";

const app = express();

app.get("/ping", (req, res) => {
  res.send("pong");
});

const PORT = parseInt(process.env.PORT || "8080");
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
