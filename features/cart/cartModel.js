import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    email: {
      type: String,
      require: true,
    },
    cart: [
      {
        productName: { type: String, require: true },
        image: { type: String, require: true },
        price: { type: String, require: true },
        qty: { type: Number },
      },
    ],
    purchase: {
      type: Array,
      require: true,
    },
    wishlist: {
      type: Array,
      default:[]
    },
  });

export const CartModel = mongoose.model("Cart",cartSchema);