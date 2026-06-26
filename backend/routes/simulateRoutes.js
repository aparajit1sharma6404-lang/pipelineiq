const express = require("express");
const router = express.Router();
const Pipeline = require("../models/Pipeline");

router.post("/", async (req, res) => {
  const pipelines = await Pipeline.find();
  for (const p of pipelines) {
    p.pressure = Math.floor(Math.random() * 50) + 50;
    p.flow = Math.floor(Math.random() * 500) + 300;
    p.temp = Math.floor(Math.random() * 40) + 60;
    p.status = p.pressure < 60 ? "Critical" : p.pressure < 75 ? "Warning" : "Healthy";
    p.lastChecked = "just now";
    await p.save();
  }

  // randomly add or remove a temp pipeline
  const rand = Math.random();
  if (rand > 0.6) {
    await new Pipeline({
      name: `Auto Line ${Date.now()}`,
      status: "Healthy",
      pressure: 80,
      flow: 600,
      temp: 70,
      lastChecked: "just now",
    }).save();
  } else if (rand < 0.3 && pipelines.length > 6) {
    await Pipeline.findByIdAndDelete(pipelines[pipelines.length - 1]._id);
  }

  res.json({ message: "Simulated" });
});

module.exports = router;
