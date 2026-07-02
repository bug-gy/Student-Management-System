import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { User } from "./models/User.js";

const seed = async () => {
  await connectDB();

  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    console.log("Admin user already exists, skipping seed.");
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash("admin@123", 12);

  await User.create({
    name: "Super Admin",
    email: "admin@sms.com",
    password: hashedPassword,
    role: "admin",
    status: "active",
  });

  console.log("Seed complete. Admin credentials:");
  console.log("  Email:    admin@sms.com");
  console.log("  Password: admin@123");

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
