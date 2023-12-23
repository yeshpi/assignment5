const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/users");
const fs = require("fs");
const path = require("path");


const PDFDocment = require("pdfkit");

exports.getProducts = (req, res, next) => {
  const page= +req.query.page||1;
  const itemPerpage=2
  // console.log(req.session);
  if (req.session.isLoggedIn) {
    console.log(req.session.isLoggedIn);
  }
  Product.countDocuments().then(count=>{
  Product.find()
  .skip((page-1)*itemPerpage)
    .limit(itemPerpage)
    .then((products) => {
      res.render("shop/product-list", {
        products: products,
        doctitle: "shop",
        path: "/products",
        count:count,
        currentPage:page,
        hasNextPage:itemPerpage*page < count,
        hasPreviousPage:page >1,
        nextPage:page +1, 
        previousPage:page-1 ,
        lastPage:Math.ceil(count/itemPerpage)  
      });
    })
    .catch((err) => console.log(err));
}).catch(err=>err)
};
exports.getIndex = (req, res, next) => {
  //cover to string and if for / return 1 page is nan
  const page= +req.query.page||1;
  const itemPerpage=2
  console.log(page,"xxxxxxxxx");
  Product.countDocuments().then(count=>{
    Product.find()
    .skip((page-1)*itemPerpage)
    .limit(itemPerpage)
    .then((products) => {
      res.render("shop/index", {
        products: products,
        doctitle: "shop",
        path: "/",
        count:count,
        currentPage:page,
        hasNextPage:itemPerpage*page < count,
        hasPreviousPage:page >1,
        nextPage:page +1, 
        previousPage:page-1 ,
        lastPage:Math.ceil(count/itemPerpage)    
      });
    })
    .catch((err) => console.log(err));

  }).catch(err=>console.log(err));
  
  
  
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      console.log(product);
      res.render("shop/product-detail", {
        product: product,
        doctitle: "Details",
        path: "/products",
        isLoggedIn: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  if (req.session.isLoggedIn) {
    User.findById(req.session.user._id)
      .populate("cart.items.productId")

      .then((result) => {
        console.log(result.cart.items);
        const products = result.cart.items;
        res.render("shop/cart", {
          products: products,
          doctitle: "Your Cart",
          path: "/cart",
          isLoggedIn: req.session.isLoggedIn,
        });
      })
      .catch((err) => console.log(err));
  } else {
    res.redirect("/login");
  }
};
exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      return User.findById(req.session.user._id)
        .then((user) => {
          user.addTocart(product);
          console.log("add to cart");
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};
// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     doctitle: "Check Out",
//     path: "/checkout",
//   });
// };
exports.getOrders = (req, res, next) => {
  if (req.session.isLoggedIn) {
    Order.find({ "user.userId": req.session.user._id })
      .select("products")
      .then((orders) => {
        console.log(orders);
        res.render("shop/orders", {
          orders: orders,
          doctitle: "Your Order",
          path: "/orders",
          isLoggedIn: req.session.isLoggedIn,
        });
      })
      .catch((err) => console.log(err));
  } else {
    res.redirect("/login");
  }
};
exports.postCartItemDelete = (req, res, next) => {
  const cartItemId = req.body.productId;

  console.log("t");
  console.log(cartItemId);
  const userId = req.session.user._id;

  User.updateOne(
    { _id: userId },
    { $pull: { "cart.items": { _id: cartItemId } } }
  )
    .then((result) => {
      console.log("Cart item deleted:", result);
      res.redirect("/cart");
    })
    .catch((error) => {
      console.error("Error deleting cart item:", error);
    });
};

exports.postOrder = (req, res, next) => {
  console.log(req.session.user);

  User.findById(req.session.user._id)
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return {
          product: { ...item.productId._doc }, // include all product details
          quantity: item.quantity,
        };
      });
      console.log(req.session.user.name, "bnbn");

      const order = new Order({
        products: products,
        user: {
          name: user.name,
          userId: user._id,
        },
      });

      return order
        .save()
        .then((result) => {
          console.log("Order created:", result);
          user.cart.items = [];
          user.save();
          res.redirect("/orders");
        })
        .catch((err) => console.error(err));
    });
};

exports.getInvoice = async (req, res, next) => {
  const orderId = req.params.orderId;
  const order = await Order.findOne({
    _id: orderId,
    "user.userId": req.session.userId,
  });
  console.log(order);
  const invoiceName = "invoice-" + orderId + ".pdf";
  //  const fileLocation=path.join('data','invoice','invoice.pdf')
  const fileLocation = path.join("data", "invoice", invoiceName);
  if (order) {
    //  fs.readFile(fileLocation,(err,data)=>{
    //   if(err){
    //    return next(err)
    //   }
    //   res.setHeader('Content-Type','application/pdf')
    //   res.setHeader('Content-Disposition','inline;filename="'+invoiceName+'"')
    //  // res.setHeader('Content-Disposition','attachment;filename="'+invoiceName+'"')
    //   res.send(data)
    //  })
    const pdfDoc = new PDFDocment();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'inline;filename="' + invoiceName + '"'
    );
    pdfDoc.pipe(fs.createWriteStream(fileLocation));
    pdfDoc.pipe(res);

    pdfDoc.fontSize(30).text("Invoice", { underline: true });
    // pdfDoc.fontSize(30).text('----------------------------')
    let totalPrice = 0;
    order.products.forEach((product) => {
      totalPrice += product.quantity *product.product.price;
      pdfDoc
        .fontSize(14)
        .text(
          product.product.title +
            "----------" +
            "X" +
           product.quantity +
            "---" +
            product.quantity * product.product.price
        );
    });

    pdfDoc.fontSize(14).text("Total Price --------------------" + totalPrice);

    pdfDoc.end();

    //*************for beiger file stream */
    //  const file=fs.createReadStream(fileLocation)
    //   res.setHeader('Content-Type','application/pdf')
    //  res.setHeader(
    //   'Content-Disposition',
    //   'inline;filename="'+invoiceName+'"'
    //   );
    //   file.pipe(res)
  } else {
    return next(new Error("order not found"));
  }
};
