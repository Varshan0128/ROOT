// server.js (for HiredAI Early Access Form)
// Root Technologies ©2025

import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // installed already

const app = express();
const PORT = process.env.PROXY_PORT || 3001;

// ✅ Your Google Apps Script Web App endpoint and secret
const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwiAmTGoVsYvEtlTuFjJhLxST6aauNnCawzUTEyclo26inBKHjVLtCR9dKY0uqJosOQ/exec";
const SECRET = "X8g4q9p_CHANGE_THIS"; // Make sure this matches your Google Apps Script secret

// Middleware
app.use(cors());
app.use(express.json());

// 🩺 Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Proxy running fine ✅" });
});

// 📨 Early Access Form proxy route
app.post("/api/early-access", async (req, res) => {
  try {
    const data = req.body || {};

    // Add secret and forward the data to Google Apps Script
    const payload = {
      ...data,
      _secret: SECRET  // Add the secret key that Google Apps Script expects
    };

    const forwardResp = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await forwardResp.text();

    // Parse or fallback to plain text
    let responseData;
    try {
      responseData = JSON.parse(text);
    } catch {
      responseData = { success: forwardResp.ok, raw: text };
    }

    // Send back to frontend
    res.set("Access-Control-Allow-Origin", "*");
    res.status(forwardResp.ok ? 200 : 500).json(responseData);
  } catch (err) {
    console.error("❌ Proxy error:", err);
    res.set("Access-Control-Allow-Origin", "*");
    res
      .status(500)
      .json({ success: false, message: err.message || "Proxy forwarding failed" });
  }
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`✅ Proxy listening on http://localhost:${PORT}`);
  console.log(`🔁 Forwarding requests to: ${GOOGLE_APPS_SCRIPT_URL}`);
});
