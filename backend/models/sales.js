import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
  date: Date,
  order_id: String,
  product: String,
  category: String,
  region: String,
  qty: Number,
  unit_price: Number,
  revenue: Number,
});

export default mongoose.model("Sale", salesSchema);