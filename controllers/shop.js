exports.getIndex = (req, res) => {
  res.render("shop/index", {
    path: "/",
    pageTitle: "Shop",
  });
};
