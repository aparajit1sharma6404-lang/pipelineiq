const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await User.deleteMany();
  const hashed = await bcrypt.hash("admin123", 10);
  await User.create({ username: "admin", password: hashed });
  console.log("Admin user created");
  process.exit();
});
