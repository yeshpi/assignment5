const express = require("express");
const path = require("path");
const rootDir = require("../util/path");
const route = express.Router();

const adminController=require('../controllers/admin');


route.get("/add-product", adminController.getAddProducts);
route.get("/products", adminController.getProducts);
route.post("/add-product", adminController.postAddProucts);
route.get("/edit-product/:productId", adminController.getEditProducts);
route.post("/edit-product/", adminController.postEditProduct);
route.post("/delete-product",adminController.postDeleteProducts)
module.exports = route;
