const express = require("express");
const authController = require("../controllers/auth");
const { check, body } = require("express-validator");
const { password } = require("../env/mongoEnv");
const User = require("../models/users");

const route = express.Router();

route.get("/login", authController.getlogin);
route.post(
  "/login",
  body("email", "not valid email").isEmail(),
  body("password", "to short password ").isLength({ min: 4 }),
  authController.postlogin
);
route.post("/signout", authController.postSignout);
route.get("/signup", authController.getSignup);
route.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .custom((value, { req }) => {
      //   if (value === "test8@test.com") {
      //     throw new Error("this email not valid");
      //   }
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("email exists");
        }
      });
    }),
  body("password", "password at list 4 chr and number")
    .isLength({ min: 4 })
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
route.post("/reset", authController.postPasswordReset);
route.post("/new-password", authController.postChangePassword);

module.exports = route;
