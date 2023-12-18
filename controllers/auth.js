const Product = require("../models/product");
const User = require("../models/users");
const bcrypt=require('bcrypt');


exports.getlogin = (req, res, next) => {
  //console.log(req.get("Cookie"));
  // console.log(req.session.isLoggedIn);
  // console.log(req.session.user);

  // res.setHeader('Set-Cookie','loggedIntrue:Max-Age-10')
  res.render("auth/login.ejs", {
    doctitle: "login",
    path: "/login",
    isLoggedIn: req.session.isLoggedIn,
    userMessage:req.flash('err')
   
  });
};

exports.postlogin = (req, res, next) => {
 const email=req.body.email
 const password=req.body.password
// User.findOne({email:email}).then(async (user)=>{
//   const hpassword=await bcrypt.hash(password,12)
// console.log(user);

// user.password=hpassword
// user.save()
// }).catch(err=>console.log(err));

 User.findOne({email:email}).then(async (user)=>{
  console.log(user);
  if(!user){
    req.flash('err',"email or passsword not found")
  return  res.redirect('/login')
  }
else{
    const check=await bcrypt.compare(password,user.password)
    if(!check){
 // if(user.password!==password){
  req.flash('err',"email or passsword not found")
    return res.redirect('/login')

  }
      console.log("User found:", user);
      req.session.isLoggedIn = true;
      req.session.user = user;

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

}
 ).catch((err) => {
      console.error("Error finding user:", err);
      res.status(500).send("Internal Server Error");
    });

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
    userMessage:req.flash('err')
  });
};
exports.postSignup =async (req, res, next) => {
  console.log(req.body.email);

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  passwordHashed=await bcrypt.hash(password,12)

  //console.log(name,email,password,passwordConfirm);
  User.findOne({ email: email })
    .then((user) => {
      console.log(user);
      
      if(user){
        req.flash('err','email account already registed ')
        return res.redirect('/signup')
      }
   const Newuser=new User({name:name,email:email,cart:{items:[]},password:passwordHashed})
        Newuser.save().then((result)=>{console.log('result');
      res.redirect('/login')}).catch(err=>console.log(err));
        
    })
    .catch((err) => console.log(err));
};
