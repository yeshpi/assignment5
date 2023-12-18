const express = require("express");
const path = require("path");
const rootDir = require("../util/path");
const route = express.Router();

const adminController=require('../controllers/admin');
const isAuth=require('../middleware/is-auth');

route.use("/",isAuth)
route.get("/add-product", isAuth,adminController.getAddProducts);
route.get("/products", isAuth,adminController.getProducts);
route.post("/add-product", isAuth,adminController.postAddProucts);
route.get("/edit-product/:productId",isAuth, adminController.getEditProducts);
route.post("/edit-product/", isAuth,adminController.postEditProduct);
route.post("/delete-product",isAuth,adminController.postDeleteProducts)
module.exports = route;
