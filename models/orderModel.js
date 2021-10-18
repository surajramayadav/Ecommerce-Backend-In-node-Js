const mongoose = require("mongoose");

const orderScehma = mongoose.Schema({
  shippingInfo: {
    address: { type: String, require: true },
    city: { type: String, require: true },
    state: { type: String, require: true },
    country: { type: String, require: true },
    pincode: { type: String, require: true },
    phoneNo: { type: String, require: true },
  },
  orderItems: [
    {
      name: { type: String, require: true },
      price: { type: String, require: true },
      quantity: { type: String, require: true },
      image: { type: String, require: true },
      product: { type: mongoose.Schema.ObjectId, ref: "Product", required: true },
      name: { type: String, require: true },
      name: { type: String, require: true },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  paymentInfo:{
    id: { type: String, require: true },
    status: { type: String, require: true },    
  },
  paidAt:{ type: Date, require: true },
  itemsPrice:{ type: Number, default:0 ,require: true},
  taxPrice:{ type: Number, default:0 ,require: true},
  shippingPrice:{ type: Number, default:0 ,require: true},
  totalPrice:{ type: Number, default:0 ,require: true},
  orderStatus: { type: String, require: true,default:"Processing" },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Order", orderScehma);