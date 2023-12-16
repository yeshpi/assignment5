const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/users");

exports.getProducts = (req, res, next) => {
 // console.log(req.session);
  if (req.session.isLoggedIn) {
    console.log(req.session.isLoggedIn);
  }
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        products: products,
        doctitle: "shop",
        path: "/products",
        isLoggedIn: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};
exports.getIndex = (req, res, next) => {
  if (req.session.isLoggedIn) {
    console.log(req.session.isLoggedIn);
  }

  Product.find()
    .then((products) => {
      res.render("shop/index", {
        products: products,
        doctitle: "shop",
        path: "/",
        isLoggedIn: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      console.log(product);
      res.render("shop/product-detail", {
        product: product,
        doctitle: "Details",
        path: "/products",
        isLoggedIn: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  if(req.session.isLoggedIn){
    User.findById(req.session.user._id)
    .populate("cart.items.productId")

    .then((result) => {
      console.log(result.cart.items);
      const products = result.cart.items;
  res.render("shop/cart", {
    products: products,
    doctitle: "Your Cart",
    path: "/cart",
    isLoggedIn: req.session.isLoggedIn,
  });
    })
    .catch((err) => console.log(err));

  }
  else{
    res.redirect('/login')
  }
 
  
};
exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      return User.findById(req.session.user._id)
        .then((user) => {
          user.addTocart(product);
          console.log("add to cart");
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};
// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     doctitle: "Check Out",
//     path: "/checkout",
//   });
// };
exports.getOrders = (req, res, next) => {
  if(req.session.isLoggedIn){
    Order.find({ "user.userId": req.session.user._id })
    .select("products")
    .then((orders) => {
      console.log(orders);
      res.render("shop/orders", {
        orders: orders,
        doctitle: "Your Order",
        path: "/orders",
        isLoggedIn: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));

  }
  else{
    res.redirect('/login')
  }
 
};
exports.postCartItemDelete = (req, res, next) => {
  const cartItemId = req.body.productId;

  console.log("t");
  console.log(cartItemId);

  console.log(req.user);
  const userId = req.user._id;

  req.user
    .updateOne({ $pull: { "cart.items": { _id: cartItemId } } })
    .then((result) => {
      console.log("Cart item deleted:", result);
      res.redirect("/cart");
    })
    .catch((error) => {
      console.error("Error deleting cart item:", error);
    });
};

exports.postOrder = (req, res, next) => {
  User.findById(req.session.user._id)
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return {
          product: { ...item.productId._doc }, // include all product details
          quantity: item.quantity,
        };
      });

      const order = new Order({
        products: products,
        user: {
          name: req.session.user.name,
          userId: req.session.user._id,
        },
      });

      return order.save().then((result) => {
        console.log("Order created:", result);
        user.cart.items = [];
        user.save();
        res.redirect("/orders");
      })
      .catch((err) => console.error(err));
    })
    
};
