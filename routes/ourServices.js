const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('ourServices', { title: 'Наши услуги' });
});

module.exports = router;
