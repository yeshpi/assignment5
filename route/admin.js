const express = require("express");
const path = require("path");
const rootDir = require("../util/path");
const route = express.Router();
const { check, body } = require("express-validator");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

route.use("/", isAuth);
route.get("/add-product", isAuth, adminController.getAddProducts);
route.get("/products", isAuth, adminController.getProducts);
route.post(
  "/add-product",
  isAuth,
  [
    check("title", "empty title").isString().trim().isLength({ min: 3 }),
    body("price", "empty price or only numbers").isFloat(),  
    body("description", "description at list 10 to 200 words ")
      .isLength({ min: 10, max: 200 })
      .trim(),
  ],
  adminController.postAddProucts
);
route.get("/edit-product/:productId", isAuth, adminController.getEditProducts);
route.post(
  "/edit-product/",
  isAuth,
  [
    check("title", "empty title").isString().trim().isLength({ min: 3 }),
    body("price", "empty price or only numbers").isFloat(),
    
    body("description", "description at list 10 to 200 words ")
      .isLength({ min: 10, max: 200 })
      .trim(),
  ],
  adminController.postEditProduct
);
route.post("/delete-product", isAuth, adminController.postDeleteProducts);
route.delete("/delete-p/:productId",isAuth,adminController.deleteProduct)
module.exports = route;
