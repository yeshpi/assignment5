exports.get404 = (req, res, next) => {
  res
    .status(404)
    .render("404", {
      doctitle: "Page not found",
      path: "404",
      isLoggedIn: req.session.isLoggedIn,
    });
};
exports.get505 = (req, res, next) => {
  res
    .status(505)
    .render("505", {
      doctitle: "Servor erro",
      path: "505",
      isLoggedIn: req.session.isLoggedIn,
    });
};
