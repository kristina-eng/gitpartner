const router = require("express").Router();
const verify = require("./verifyToken");

router.get("/", verify, (req, res) => {
  res.send( {
    message: "Token works fine!",
    user: req.user,
  });
  res.render('posts', {title: 'POSTS'});
});


module.exports = router;
