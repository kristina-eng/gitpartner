const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('news', { title: 'Новости' });
});

module.exports = router;
