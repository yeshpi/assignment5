const mongoEnv = require("./env/mongoEnv");
const express = require("express");
const session = require("express-session");
const MongoDBstore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

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
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "image");
  },
  filename: (req, file, cb) => {
    cb(null,uuidv4()+"-" +file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
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
app.use(express.static(path.join(__dirname, "public")));
app.use('/image',express.static(path.join(__dirname, "image")));
//app.use(multer(dest:'image').single('image'))
//app.use(multer({storage:fileStorage}).single('image'))
//set cooki
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  //console.log('Session Object:', req.session);
  next();
});
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
  res.locals.userId = req.session.userId;
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use("/admin", adminRout);
app.use(loginRout);
app.use(shopRout);
//app.get('/500',errorController.get505)
app.use(errorController.get404);
app.use((error,req,res,next)=>{
  //res.status(error.httpStatusCode).rende('/500','')
  //res.redirect('/500')
  res.render('505',{
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
