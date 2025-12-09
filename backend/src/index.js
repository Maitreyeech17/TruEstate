import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import transactionRoutes from "./routes/transactionRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB before starting server
async function startServer() {
  try {
    // Connect to database
    await connectDB(process.env.MONGODB_URI);
    
    // Mount routes
    app.use("/api/transactions", transactionRoutes);
    
    // Health check
    app.get("/", (req, res) => {
      res.json({ 
        ok: true, 
        message: "TruEstate API",
        database: "truestate",
        collection: "truEstate"
      });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ 
        success: false, 
        message: "Route not found" 
      });
    });

    // Error handler
    app.use((err, req, res, next) => {
      console.error("Server error:", err);
      res.status(500).json({ 
        success: false, 
        message: err.message || "Internal server error" 
      });
    });

    // Start server
    const port = process.env.PORT || 5001;
    app.listen(port, () => {
      console.log(`\n🚀 Server running on port ${port}`);
      console.log(`📍 http://localhost:${port}`);
      console.log(`📍 http://localhost:${port}/api/transactions`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();