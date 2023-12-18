const Product = require("../models/product");
const User= require('../models/users');




exports.getAddProducts = (req, res, next) => {

  
  res.render("admin/edit-product", {
    doctitle: "add product",
    path: "/admin/add-product",
    editing: false,
    isLoggedIn:req.session.isLoggedIn
  });
};
exports.postAddProucts = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product({
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
    .catch((err) => console.log(err));
};
exports.getEditProducts = (req, res, next) => {
  const editMode = req.query.edit;
  console.log(editMode);

  if (!editMode) {
    return res.redirect("/");
  }
  const productId = req.params.productId;

  Product.findById(productId)
    .then((products) => {
      console.log(products);

      res.render("admin/edit-product", {
        doctitle: "Edit product",
        path: "/admin/add-edit",
        editing: editMode,
        product: products,
        isLoggedIn:req.session.isLoggedIn
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
  Product.findById(productId)
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
  
  Product.findByIdAndDelete(productId)
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
  // Product.findById(productId)
  //   .then((product) => {
  //     product
  //       .deleteOne()
  //       .then((result) => {
  //         console.log('product deleted');
  //         res.redirect("/admin/products");
  //       })
  //       .catch((err) => console.log(err));
  //   })
  //   .catch((err) => console.log(err));
};
