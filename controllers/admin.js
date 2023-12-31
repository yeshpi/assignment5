const Product = require("../models/product");
const User= require('../models/users');
const {validationResult}=require('express-validator');


exports.getAddProducts = (req, res, next) => {
  
  res.render("admin/edit-product", {
    doctitle: "add product",
    path: "/admin/add-product",
    editing: false,
    isLoggedIn:req.session.isLoggedIn,
    userMessage:req.flash('err'),
    errorPath:[],
    userData:{
      title:"",
      price:"",
      imageUrl:"",
      description:""
    }
  });
};
exports.postAddProucts = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors=validationResult(req).array()
  if(!errors.length<=0){
    console.log(errors);
    
    let errorMessage = errors.map((err) => err.msg).join(",");    
    let errorpath=errors.map((err) => err.path).join(",");
    req.flash('err',errorMessage)
    return  res.render("admin/edit-product", {
      doctitle: "add product",
      path: "/admin/add-product",
      editing: false,
      isLoggedIn:req.session.isLoggedIn,
      userMessage:req.flash('err'),
      errorPath:errorpath,
      userData:{
        title:title,
        price:price,
        imageUrl:imageUrl,
        description:description
      }
    });
  }
else{
  const product = new Product({
    //_id:'65834db6469dfb6a86f66c10',
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    //userId:req.user._id    works too 
    userId:req.session.user._id
  });
 
  product
    .save()
    .then((result) => {
      console.log("product add");
      res.redirect("/admin/products");
    })
    .catch((err) =>{ console.log(err)
    
    //res.redirect('/500');
   const  error=new Error(err)
   error.httpStatusCode=500
   return next(error)
    
    });
  }
};
exports.getEditProducts = (req, res, next) => {
  const editMode = req.query.edit;
  console.log(editMode);

  if (!editMode) {
    return res.redirect("/");
  }
  const productId = req.params.productId;
console.log(req.session.user._id,"uuuuu");

  Product.findOne({_id:productId,userId:req.session.user._id})
    .then((products) => {
      console.log(products);
      if(!products)
      {
        return res.redirect('/admin/add-product')
      }

      res.render("admin/edit-product", {
        doctitle: "Edit product",
        path: "/admin/add-edit",
        editing: editMode,
        product: products,
        isLoggedIn:req.session.isLoggedIn,
        userMessage:req.flash('err'),
      errorPath:[],
      userData:{
        productId:"",
        title:"",
        price:"",
        imageUrl:"",
        description:""
      }
      });
    })
    .catch((err) => console.log(err));
};
exports.postEditProduct = (req, res, next) => {
  // const userId = req.userId;
  // console.log(userId);

  const productId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors=validationResult(req).array()
  if(!errors.length<=0){
    let errorMessage = errors.map((err) => err.msg).join(",");    
    let errorpath=errors.map((err) => err.path).join(",");
    req.flash('err',errorMessage)
    return  res.render("admin/edit-product", {
      doctitle: "edit product",
      path: "/admin/add-product",
      editing: true,
      isLoggedIn:req.session.isLoggedIn,
      userMessage:req.flash('err'),
      errorPath:errorpath,
      userData:{
        productId:productId,
        title:title,
        price:price,
        imageUrl:imageUrl,
        description:description
      }
    });

  }
  else{
  Product.findOne({_id:productId,userId:req.session.user._id})
    .then((product) => {
      product.title = title;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      product.save();
    })
    .then((result) => {
      console.log(result);
      console.log("updated");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
  }
};

exports.getProducts = (req, res, next) => {
  Product.find({userId:req.session.user._id})
  // .select('title price  -_id') select what to get from product object no all info
  // .populate('userId','name email -_id') to fill the user related info with selected info
    .then((products) => {
      console.log(products);
      res.render("admin/products", {
        products: products,
        doctitle: "Admin Products",
        path: "/admin/products",
        isLoggedIn:req.session.isLoggedIn
      });
    })
    .catch((err) => console.log(err));
};
exports.postDeleteProducts = (req, res, next) => {
  const productId = req.body.productId;
  console.log('del',productId);
  
  Product.deleteOne({_id:productId,userId:req.session.user._id})
    .then((result) => {
      console.log(result);
      console.log("product deleted");
      
      return User.updateMany(        
        { 'cart.items.productId': productId },
        { $pull: { 'cart.items': { productId: productId } } }
      );
     
    }).then(result=>{
      console.log('cart');
      
      res.redirect("/admin/products");
      console.log(result)})
    .catch((err) => console.log(err));

};
