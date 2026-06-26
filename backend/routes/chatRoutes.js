const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const Pipeline = require("../models/Pipeline");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/", async (req, res) => {
  const { message } = req.body;
  const pipelines = await Pipeline.find();
  const pipelineData = pipelines.map(p =>
    `${p.name}: pressure=${p.pressure}bar, flow=${p.flow}m³/h, temp=${p.temp}°C, status=${p.status}`
  ).join("\n");
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: `You are PipelineIQ AI, an expert refinery operations assistant. Current live pipeline data:\n${pipelineData}\nBe concise.` },
      { role: "user", content: message }
    ],
  });
  res.json({ reply: response.choices[0].message.content });
});

module.exports = router;
