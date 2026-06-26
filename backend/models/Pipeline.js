const mongoose = require("mongoose");
const pipelineSchema = new mongoose.Schema({
  name: String, status: String,
  pressure: Number, flow: Number,
  temp: Number, lastChecked: String,
});
module.exports = mongoose.model("Pipeline", pipelineSchema);
