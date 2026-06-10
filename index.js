const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json({ limit: "1mb" }));

const TOKEN = process.env.API_TOKEN;

// -------------------------
// AUTH MIDDLEWARE
// -------------------------
app.use((req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || auth !== `Bearer ${TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
});

// -------------------------
// OLLAMA BASE URL (Windows via Tailscale)
// -------------------------
const OLLAMA_URL = process.env.OLLAMA_URL;

// -------------------------
// GENERATE
// -------------------------
app.post("/api/generate", async (req, res) => {
  try {
    const response = await axios.post(
      `${OLLAMA_URL}/api/generate`,
      req.body
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({
      error: "Error calling Ollama",
      details: err.message
    });
  }
});

// -------------------------
// EMBED
// -------------------------
app.post("/api/embed", async (req, res) => {
  try {
    const response = await axios.post(
      `${OLLAMA_URL}/api/embed`,
      req.body
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({
      error: "Error calling Ollama",
      details: err.message
    });
  }
});

// -------------------------
app.listen(3000, () => {
  console.log("Gateway running on port 3000");
});