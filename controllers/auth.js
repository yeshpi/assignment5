const { password } = require("../env/mongoEnv");
const Product = require("../models/product");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

exports.getlogin = (req, res, next) => {
  //console.log(req.get("Cookie"));
  // console.log(req.session.isLoggedIn);
  // console.log(req.session.user);

  // res.setHeader('Set-Cookie','loggedIntrue:Max-Age-10')

  res.render("auth/login.ejs", {
    doctitle: "login",
    path: "/login",
    isLoggedIn: req.session.isLoggedIn,
    userMessage: req.flash("err"),
    errorPath: [],
    userData: {
      email: "",
      password: "",
    },
  });
};

exports.postlogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req).array();
  if (!errors.length <= 0) {
    let errorMessage = errors.map((err) => err.msg).join(",");
    let errorpath = errors.map((err) => err.path).join(",");
    req.flash("err", errorMessage);
    return res.render("auth/login.ejs", {
      doctitle: "login",
      path: "/login",
      isLoggedIn: req.session.isLoggedIn,
      userMessage: req.flash("err"),
      errorPath: errorpath,
      userData: {
        email: email,
        password: password,
      },
    });
  } else {
    User.findOne({ email: email })
      .then(async (user) => {
        console.log(user);
        if (!user) {
          req.flash("err", "email or passsword not found");
          return res.render("auth/login.ejs", {
            doctitle: "login",
            path: "/login",
            isLoggedIn: req.session.isLoggedIn,
            userMessage: req.flash("err"),
            errorPath: ["email", "password"],
            userData: {
              email: email,
              password: password,
            },
          });
        } else {
          const check = await bcrypt.compare(password, user.password);
          if (!check) {
            // if(user.password!==password){
            req.flash("err", "email or passsword not found");
            return res.render("auth/login.ejs", {
              doctitle: "login",
              path: "/login",
              isLoggedIn: req.session.isLoggedIn,
              userMessage: req.flash("err"),
              errorPath: ["email", "password"],
              userData: {
                email: email,
                password: password,
              },
            });
          }
          console.log("User found:", user);
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.userId = user._id;

          req.session.save((err) => {
            if (err) {
              console.error("Error saving session:", err);
            } else {
              console.log("Session saved");
              res.redirect("/");
            }
          });

          //   })
          //   .catch((err) => {
          //     console.error("Error finding user:", err);
          //     res.status(500).send("Internal Server Error");
          //   });
        }
      })
      .catch((err) => {
        console.error("Error finding user:", err);
        res.status(500).send("Internal Server Error");
      });
  }
  //domain ,expiration time secure httponly Max-Age=10 sesonds
  //   // res.setHeader('Set-Cookie','loggedIn=true;Max-Age=10;HttpOnly')
  // User.findById("657be0cfa8e6db8435b7e461")
  //   .then((user) => {
  //     console.log("User found:", user);
  //     req.session.isLoggedIn = true;
  //     req.session.user = user;

  //     req.session.save((err) => {
  //       if (err) {
  //         console.error("Error saving session:", err);
  //       } else {
  //         console.log("Session saved");
  //         res.redirect("/");
  //       }
  //     });

  //   })
  //   .catch((err) => {
  //     console.error("Error finding user:", err);
  //     res.status(500).send("Internal Server Error");
  //   });
};
exports.postSignout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
};
exports.getSignup = (req, res, next) => {
  res.render("auth/signup.ejs", {
    doctitle: "SingUp",
    path: "/signup",
    isLoggedIn: req.session.isLoggedIn,
    userMessage: req.flash("err"),
    userData: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
    errorPath: [],
  });
};
exports.postSignup = async (req, res, next) => {
  console.log(req.body.email);

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  const errors = validationResult(req).array();

  if (!errors.length <= 0) {
    let errorMessage = errors.map((err) => err.msg).join(",");
    console.log(errorMessage, "ok", errors);
    let errorpath = errors.map((err) => err.path).join(",");
    console.log(errorMessage[0]);
    req.flash("err", errorMessage);
    return res.status(422).render("auth/signup.ejs", {
      doctitle: "SingUp",
      path: "/signup",
      isLoggedIn: req.session.isLoggedIn,
      userMessage: req.flash("err"),
      userData: {
        name: name,
        email: email,
        password: password,
        passwordConfirm: passwordConfirm,
      },
      errorPath: errorpath,
    });
  } else {
    passwordHashed = await bcrypt.hash(password, 12);

    //console.log(name,email,password,passwordConfirm);
    User.findOne({ email: email })
      .then((user) => {
        console.log(user);

        if (user) {
          req.flash("err", "email account already registed ");
          return res.render("auth/signup.ejs", {
            doctitle: "SingUp",
            path: "/signup",
            isLoggedIn: req.session.isLoggedIn,
            userMessage: req.flash("err"),
            userData: {
              name: name,
              email: email,
              password: password,
              passwordConfirm: passwordConfirm,
            },
            errorPath: ["email"],
          });
        } else {
          const Newuser = new User({
            name: name,
            email: email,
            cart: { items: [] },
            password: passwordHashed,
          });
          Newuser.save()
            .then((result) => {
              console.log("result");
              res.redirect("/login");
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }
};
exports.getPasswordReset = (req, res, next) => {
  res.render("auth/reset.ejs", {
    doctitle: "password reset",
    path: "/password",
    isLoggedIn: req.session.isLoggedIn,
    userMessage: req.flash("err"),
    userData: { email: "" },
    errorPath: [],
  });
};

exports.postPasswordReset = async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });
  const token = crypto.randomBytes(32).toString("hex");
  const errors = validationResult(req).array();
  console.log(email, user, token);
  if (!errors.length <= 0) {
    let errorMessage = errors.map((err) => err.msg).join(",");
    let errorpath = errors.map((err) => err.path).join(",");
    req.flash("err", errorMessage);
    return res.render("auth/reset.ejs", {
      doctitle: "password reset",
      path: "/password",
      isLoggedIn: req.session.isLoggedIn,
      userMessage: req.flash("err"),
      userData: {
        email: email,
      },
      errorPath: errorpath,
    });
  } else {
    if (!user) {
      await req.flash("err", "email doest exit ");
      return res.render("auth/reset.ejs", {
        doctitle: "password reset",
        path: "/password",
        isLoggedIn: req.session.isLoggedIn,
        userMessage: req.flash("err"),
        userData: {
          email: email,
        },
        errorPath: ["email"],
      });
    } else {
      user.resetToken = token;
      user.tokenExpiraionDate = Date.now() + 1 * 60 * 60 * 10000; //1hour
      user
        .save()
        .then((result) => {
          console.log("send email");
          //send email
          console.log(result);
          res.redirect("/");
        })
        .catch((err) => console.log(err));
    }
  }
};

exports.getPasswordChange = async (req, res, next) => {
  const tokenId = req.params.tokenId;
  const user = await User.findOne({
    resetToken: tokenId,
    tokenExpiraionDate: { $gt: Date.now() },
  });
  console.log(tokenId);
  console.log(user);

  if (user) {
   return  res.render("auth/new-password.ejs", {
      doctitle: "password reset",
      path: "/password",
      userMessage: req.flash("err"),
      userId: user._id,
      tokenId:tokenId,
      userData: { password: "", passwordConfirm: "" },
      errorPath:[]
    });
  } else {
    console.log("x");
    req.flash("err", "reset token expired or internal server error");
    res.redirect("/reset");
  }
};
exports.postChangePassword = async (req, res, next) => {
  const userId = req.body.userId;
  //const tokenId = req.params.tokenId;
  const password = req.body.password;
  const tokenId=req.body.tokenId;
  const passwordConfirm = req.body.passwordConfirm;
  const passwordHashed = await bcrypt.hash(password, 12);
  const errors = validationResult(req).array();
 

  if (!errors.length <= 0) {
    let errorMessage = errors.map((err) => err.msg).join(",");
    let errorpath = errors.map((err) => err.path).join(",");
    req.flash("err", errorMessage);
    // res.url = `/reset/${tokenId}`
    return res.render("auth/new-password.ejs", {
      doctitle: "password reset",
      path: "/password",
      userMessage: req.flash("err"),
      userId:userId,
      tokenId:tokenId,
      userData: { password: "", passwordConfirm: "" },
      errorPath:errorpath
    });
    
  }
  else { 
    console.log(tokenId,'bbb');
    
  const user = await User.findOne({ _id: userId ,resetToken: tokenId,
    tokenExpiraionDate: { $gt: Date.now() }});
  if (!user) {
    req.flash("err", "something waint wrong");
    return res.redirect("/login");
  }
  user.password = passwordHashed;
  user.resetToken = crypto.randomBytes(32).toString("hex");
  user.tokenExpiraionDate = Date.now();
  user
    .save()
    .then((result) => {
      console.log('change');
      
      console.log(result);
      res.redirect("/login");
    })
    .catch((err) => console.log(err));}
};
