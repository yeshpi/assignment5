const express = require("express");
const path = require("path");
const rootDir = require("../util/path");
const adminRout = require("./admin");
const route = express.Router();
const shopController=require('../controllers/shop');



route.get("/",shopController.getIndex );
 route.get("/products", shopController.getProducts);
route.get("/products/:productId", shopController.getProduct);
 route.get("/cart", shopController.getCart);
route.post("/cart", shopController.postCart);
// // route.get("/checkout", shopController.getCheckout);
 route.get("/orders", shopController.getOrders);
 route.post("/create-order", shopController.postOrder);
route.post("/cart-delete-item",shopController.postCartItemDelete)




module.exports = route;
