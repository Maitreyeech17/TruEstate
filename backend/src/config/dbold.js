/*
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
*/
import mongoose from "mongoose";

export default async function connectDB(uri) {
  try {
    if (!uri) throw new Error("MONGODB_URI not provided");
    await mongoose.connect(uri, {
      // options are fine to be default for mongoose v7+
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}
