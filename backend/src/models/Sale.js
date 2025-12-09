import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema(
  {
    CustomerName: String,
    PhoneNumber: String,
    CustomerRegion: String,
    Gender: String,
    Age: Number,

    ProductCategory: String,
    ProductName: String,
    Price: Number,
    PurchaseAmount: Number,

    PaymentMethod: String,
    Tags: [String],

    Date: Date
  },
  { timestamps: true }
);

export default mongoose.model("Sale", SaleSchema);
