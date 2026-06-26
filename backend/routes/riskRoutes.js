const express = require("express");
const router = express.Router();
const Pipeline = require("../models/Pipeline");

const calcRisk = (p) => {
  let score = 0;
  if (p.pressure < 50) score += 40;
  else if (p.pressure < 65) score += 20;
  else if (p.pressure > 90) score += 30;

  if (p.temp > 85) score += 30;
  else if (p.temp > 75) score += 15;

  if (p.flow < 350) score += 30;
  else if (p.flow < 450) score += 10;

  if (p.status === "Critical") score += 20;
  else if (p.status === "Warning") score += 10;

  return Math.min(score, 100);
};

router.get("/", async (req, res) => {
  const pipelines = await Pipeline.find();
  const risks = pipelines.map(p => ({
    _id: p._id,
    name: p.name,
    status: p.status,
    pressure: p.pressure,
    flow: p.flow,
    temp: p.temp,
    riskScore: calcRisk(p),
  }));
  risks.sort((a, b) => b.riskScore - a.riskScore);
  res.json(risks);
});

module.exports = router;
