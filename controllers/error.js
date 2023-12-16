exports.get404 = (req, res, next) => {
  res
    .status(404)
    .render("404", {
      doctitle: "Page not found",
      path: "",
      isLoggedIn: req.session.isLoggedIn,
    });
};
