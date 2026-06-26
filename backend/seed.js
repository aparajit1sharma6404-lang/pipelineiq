const mongoose = require("mongoose");
require("dotenv").config();
const Pipeline = require("./models/Pipeline");

const data = [
  { name: "Panipat Main Feed", status: "Healthy", pressure: 91, flow: 820, temp: 68, lastChecked: "2 min ago" },
  { name: "Gujarat Crude Line", status: "Warning", pressure: 74, flow: 610, temp: 82, lastChecked: "5 min ago" },
  { name: "Barauni Offsite-A", status: "Healthy", pressure: 88, flow: 740, temp: 71, lastChecked: "1 min ago" },
  { name: "Mathura Export Line", status: "Critical", pressure: 52, flow: 290, temp: 94, lastChecked: "8 min ago" },
  { name: "Haldia Crude Loop", status: "Healthy", pressure: 95, flow: 890, temp: 65, lastChecked: "3 min ago" },
  { name: "Digboi North Feed", status: "Warning", pressure: 69, flow: 520, temp: 79, lastChecked: "6 min ago" },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Pipeline.deleteMany();
  await Pipeline.insertMany(data);
  console.log("Seeded!");
  process.exit();
});
