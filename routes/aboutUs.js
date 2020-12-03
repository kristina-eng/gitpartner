const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('aboutUs', { title: 'О Нас' });
});

module.exports = router;
