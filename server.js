const mongoEnv = require("./env/mongoEnv");
const express = require("express");
const session = require("express-session");
const MongoDBstore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash=require('connect-flash');


const path = require("path");
const bodyParser = require("body-parser");
const adminRout = require("./route/admin");
const shopRout = require("./route/shop");
const errorController = require("./controllers/error");
const User = require("./models/users");
const mongoose = require("mongoose");
const loginRout = require("./route/auth");

const app = express();
const store = new MongoDBstore({
  uri: mongoEnv.url,
  collection: "sessions",
});

let port = 3000;
const csrfProtection = csrf();
app.set("view engine", "ejs");
app.set("views", "view");
app.use(
  session({
    secret: mongoEnv.sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
//set cooki
app.use(csrfProtection);
app.use(flash())
app.use(express.static(path.join(__dirname, "public")));
// app.use((req, res, next) => {
//   console.log('Session Object:', req.session);
//   next();
// });
app.use((req,res,next)=>{
  if(!req.user){
    return next()
  }
  User.findById(req.user._id).then((user)=>{
  if(!user){
    return next()
  }
  req.user=user
  
  }).catch(err=>{
    //it will not work  in side callback or then block
    //this work for async try catch block
   // throw new Error(err)
   next(new Error(err))
  
  
  });

})

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.userId=req.session.userId
 res.locals.csrfToken = req.csrfToken();
  next();
});
app.use("/admin", adminRout);
app.use(loginRout);
app.use(shopRout);
app.get('/500',errorController.get505)
app.use(errorController.get404);
app.use((error,req,res,next)=>{
  //res.status(error.httpStatusCode).rende('/500','')
  //res.redirect('/500')
  res.status(error.httpStatusCode).rende('/500',{
    doctitle:"server error",
    path: "505",
    isLoggedIn: req.session.isLoggedIn,
  })

})
mongoose
  .connect(mongoEnv.url)
  .then((result) => {
    app.listen(port);
    console.log("connected");
  })
  .catch((err) => console.log(err));
