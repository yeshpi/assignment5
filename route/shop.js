const express = require("express");
const path = require("path");
const rootDir = require("../util/path");
const adminRout = require("./admin");
const route = express.Router();
const shopController=require('../controllers/shop');
const isAuth=require('../middleware/is-auth');


//route.use(isAuth)
route.get("/",shopController.getIndex );
 route.get("/products", shopController.getProducts);
route.get("/products/:productId", shopController.getProduct);
 route.get("/cart", isAuth,shopController.getCart);
route.post("/cart", isAuth,shopController.postCart);
// // route.get("/checkout",isAuth, shopController.getCheckout);
 route.get("/orders", isAuth,shopController.getOrders);
 route.post("/create-order", isAuth,shopController.postOrder);
route.post("/cart-delete-item",isAuth,shopController.postCartItemDelete)
route.get('/order/:orderId',isAuth,shopController.getInvoice)




module.exports = route;
