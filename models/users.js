const mongoose = require("mongoose");
const Schema = mongoose.Schema;

userSchema = new Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  password:{type:String,require:true},
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});
userSchema.methods.addTocart = function (product) {
  const cartItemIndex = this.cart.items.findIndex((item) =>
    item.productId.equals(product._id)
  );
  let defualtQuntity = 1;
  if (cartItemIndex >= 0) {
    this.cart.items[cartItemIndex].quantity =
      this.cart.items[cartItemIndex].quantity + defualtQuntity;
  } else {
    this.cart.items.push({ productId: product._id, quantity: defualtQuntity });
  }
  return this.save();
};


module.exports = mongoose.model("User", userSchema);
