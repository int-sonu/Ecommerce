import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  items: [
    {
      product_name: { type: String, required: true },
      quantity: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true, min: 0 },
      subtotal: { type: Number },
      image: { type: String },
    },
  ],

  Total: {
    type: Number,
    required: true,
  },

  order_status: {
    type: String,
    enum: ["Ordered", "Shipped", "Delivered", "Cancelled"],
    default: "Ordered",
  },

  order_date: {
    type: Date,
    default: Date.now,
  },

  updated_at: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

export const Order = mongoose.model("Order", orderSchema);
