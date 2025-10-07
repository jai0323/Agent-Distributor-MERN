import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Agent from "./models/Agent.js"; 

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const count = await Agent.countDocuments();
    if (count >= 5) {
      console.log("Already have 5 or more agents.");
      process.exit();
    }

    const agents = [];
    for (let i = 1; i <= 5; i++) {
      const hashedPassword = await bcrypt.hash(`password${i}`, 10);
      agents.push({
        name: `Agent ${i}`,
        email: `agent${i}@example.com`,
        mobile: `+91999999999${i}`,
        passwordHash: hashedPassword,
      });
    }

    await Agent.insertMany(agents);
    console.log("5 agents inserted successfully!");
    process.exit();
  })
  .catch((err) => console.error(err));
