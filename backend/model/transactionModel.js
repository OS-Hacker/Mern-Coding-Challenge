import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
    },
    sold: {
      type: Boolean,
      default: false,
    },
    dateOfSale: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const TransactionModel = mongoose.model(
  "transaction",
  transactionSchema
);
