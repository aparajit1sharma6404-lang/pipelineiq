const express = require("express");
const router = express.Router();
const Pipeline = require("../models/Pipeline");

router.get("/", async (req, res) => res.json(await Pipeline.find()));
router.post("/", async (req, res) => res.json(await new Pipeline(req.body).save()));
router.delete("/:id", async (req, res) => {
  await Pipeline.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});
module.exports = router;
