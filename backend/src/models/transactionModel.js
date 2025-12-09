import mongoose from "mongoose";

/**
 * Schema matching your MongoDB document structure exactly
 * Database: truEstate
 * Collection: truestate
 */
const transactionSchema = new mongoose.Schema(
  {
    "Transaction ID": Number,
    "Date": Date,
    "Customer ID": String,
    "Customer Name": String,
    "Phone Number": mongoose.Schema.Types.Mixed,
    "Gender": String,
    "Age": Number,
    "Customer Region": String,
    "Customer Type": String,
    "Product ID": String,
    "Product Name": String,
    "Brand": String,
    "Product Category": String,
    "Tags": String,
    "Quantity": Number,
    "Price per Unit": Number,
    "Discount Percentage": Number,
    "Total Amount": Number,
    "Final Amount": Number,
    "Payment Method": String,
    "Order Status": String,
    "Delivery Type": String,
    "Store ID": String,
    "Store Location": String,
    "Salesperson ID": String,
    "Employee Name": String
  },
  { 
    collection: "truEstate", // MUST match your MongoDB collection name exactly
    strict: false,
    timestamps: false
  }
);

// Create indexes for better query performance
transactionSchema.index({ "Customer Name": 1 });
transactionSchema.index({ "Customer Region": 1 });
transactionSchema.index({ "Product Category": 1 });
transactionSchema.index({ "Gender": 1 });
transactionSchema.index({ "Payment Method": 1 });
transactionSchema.index({ "Date": -1 });
transactionSchema.index({ "Age": 1 });

// Export model - name can be anything, collection is what matters
export default mongoose.model("Transaction", transactionSchema);