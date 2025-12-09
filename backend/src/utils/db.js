import mongoose from "mongoose";

const connectDB = async (uri) => {
  try {
    // Add detailed connection options
    const options = {
      dbName: "truestate", // Explicitly specify database name
      retryWrites: true,
      w: "majority",
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    console.log("Connecting to MongoDB...");
    console.log("Database:", options.dbName);
    
    await mongoose.connect(uri, options);
    
    console.log("✅ MongoDB Connected Successfully");
    console.log("Connected to database:", mongoose.connection.db.databaseName);
    
    // List all collections to verify
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));
    
    // Verify the truEstate collection exists and has documents
    const count = await mongoose.connection.db.collection("truEstate").countDocuments();
    console.log(`✅ Collection 'truEstate' has ${count} documents`);
    
    if (count === 0) {
      console.warn("⚠️  WARNING: truEstate collection is empty!");
    }

    // Test query
    const sample = await mongoose.connection.db.collection("truEstate").findOne({});
    if (sample) {
      console.log("✅ Sample document found:");
      console.log("  - Customer Name:", sample["Customer Name"]);
      console.log("  - Date:", sample["Date"]);
    }

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }

  // Handle connection events
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });
};

export default connectDB;