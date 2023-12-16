const Product = require("../models/product");
const User = require("../models/users");

exports.getlogin = (req, res, next) => {
  //console.log(req.get("Cookie"));
  console.log(req.session.isLoggedIn);
  console.log(req.session.user);

  // res.setHeader('Set-Cookie','loggedIntrue:Max-Age-10')
  res.render("auth/login.ejs", {
    doctitle: "login",
    path: "/login",
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.postlogin = (req, res, next) => {

    //domain ,expiration time secure httponly Max-Age=10 sesonds
//   // res.setHeader('Set-Cookie','loggedIn=true;Max-Age=10;HttpOnly')
    User.findById("657be0cfa8e6db8435b7e461")
    .then((user) => {
      console.log("User found:", user);
      req.session.isLoggedIn = true;
      req.session.user = user;

      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
        } else {
          console.log('Session saved');
        }
      });

      res.redirect("/");
    })
    .catch((err) => {
      console.error('Error finding user:', err);
      res.status(500).send('Internal Server Error');
    });
}
exports.getSignout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
          console.log(err);
        } else {        
          res.redirect("/");
        }
      });
 
};
