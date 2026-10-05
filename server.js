const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

function buildScannerPrompt({ content, url, mode }) {
  const modeInstructions = {
    summary: "Provide a concise summary with key takeaways.",
    risks: "Identify red flags, risks, and concerns. Highlight anything suspicious or high-impact.",
    sentiment: "Assess tone, sentiment, and emotional intent. Explain the overall feeling of the text.",
    actions: "Extract action items, priorities, and next steps for the reader."
  };

  return `
You are an AI scanner that analyzes submitted content.

Mode: ${mode}
Source URL: ${url || "Not provided"}

Instructions:
${modeInstructions[mode] || modeInstructions.summary}

Respond in sections:
1. Overview
2. Key findings
3. Risks / concerns (if any)
4. Suggested next actions

Content to analyze:
${content}
`; 
}

app.post("/api/scan", async (req, res) => {
  const { content = "", url = "", mode = "summary" } = req.body || {};

  if (!content || content.trim().length < 10) {
    return res.status(400).json({
      error: "Please provide at least 10 characters of content to scan."
    });
  }

  if (!openai) {
    return res.status(500).json({
      error: "OPENAI_API_KEY is not configured. Add it to your .env file."
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: "You are a practical and clear AI content scanner that produces helpful, structured results."
        },
        {
          role: "user",
          content: buildScannerPrompt({ content, url, mode })
        }
      ]
    });

    const result = completion.choices?.[0]?.message?.content || "No response returned.";

    res.json({
      result,
      mode,
      url,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("OpenAI scan error:", error);

    res.status(500).json({
      error: "The scan failed. Check your OpenAI API key and billing/model access."
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`ChatGPT AI Scanner running on http://localhost:${port}`);
});
