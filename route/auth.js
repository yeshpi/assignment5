const express = require("express");
const authController = require("../controllers/auth");
const { check, body } = require("express-validator");
const { password } = require("../env/mongoEnv");
const User = require("../models/users");

const route = express.Router();

route.get("/login", authController.getlogin);
route.post(
  "/login",
  body("email", "not valid email").isEmail().normalizeEmail().trim(),
  body("password", "to short password ")
    .isLength({ min: 4 })
    .trim()
    .isAlphanumeric(),
  authController.postlogin
);
route.post("/signout", authController.postSignout);
route.get("/signup", authController.getSignup);
route.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .custom(async (value, { req }) => {
      //   if (value === "test8@test.com") {
      //     throw new Error("this email not valid");
      //   }
      const user = await User.findOne({ email: value });
      if (user) {
        return Promise.reject("email exists");
      }
    })
    .normalizeEmail()
    .trim(),
  body("password", "password at list 4 chr and number")
    .isLength({ min: 4 })
    .trim()
    .isAlphanumeric(),
  body("passwordConfirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("password do not match");
    }
    return true;
  }),
  authController.postSignup
);
route.get("/reset", authController.getPasswordReset);
route.get("/reset/:tokenId", authController.getPasswordChange);
route.post( "/reset",body('email','not valid email').isEmail().trim() , authController.postPasswordReset);
route.post("/new-password",[
  body("password", "password at list 4 chr and number")
    .isLength({ min: 4 })
    .trim()
    .isAlphanumeric(),
  body("passwordConfirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("password do not match");
    }
    return true;
  }),
], authController.postChangePassword);

module.exports = route;
