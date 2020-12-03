const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../model/User');
const path = require('path');
const hbs = require('handlebars');
const bcrypt = require('bcryptjs');
const puppeteer = require('puppeteer');
const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const { registerValidation, loginValidation } = require('../validation');

const todays_date = new Date();

// router для рендера страницы авторизации
router.get('/login', (req, res, next) => {
  res.render('login', { title: 'Авторизация' });
});

// router для поиска залогиненного пользователя и рендера страницы авторизации
router.get('/login/:id', async (req, res, next) => {
  const id = req.params.id;
  await User.findById(id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      res.render('test', {
        title: 'Личный кабинет',
        id: user._id,
        name: user.name,
        inn: user.inn,
        org: user.org,
        kpp: user.kpp,
        ogrn: user.ogrn,
        ua: user.ua,
        phone: user.phone,
      });
    }
  });
});

// router для редактирования данных пользователя и рендер страницы редактирования
router.get('/login/:id/edit', async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  await User.findById(id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      res.render('edit', {
        title: 'Редактирование пользователя',
        id: user._id,
        name: user.name,
        inn: user.inn,
        org: user.org,
        kpp: user.kpp,
        ogrn: user.ogrn,
        ua: user.ua,
        phone: user.phone,
      });
    }
  });
});

// router для изменения и применения данных после редактирования
router.put('/login/:id', async (req, res, next) => {
  const id = req.params.id;
  await User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      inn: req.body.inn,
      org: req.body.org,
      kpp: req.body.kpp,
      ogrn: req.body.ogrn,
      ua: req.body.ua,
      phone: req.body.phone,
    },
    function (err, user) {
      if (err) {
        console.log(err);
      } else {
        res.redirect(`/api/user/login/${req.params.id}`);
      }
    },
  );
});

// router для удаления пользователя из бд
router.delete('/login/:id', async (req, res, next) => {
  const id = req.params.id;
  await User.findByIdAndDelete(id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/api/user/login');
    }
  });
});

// router для рендера страницы оформления документа
router.get('/register', (req, res, next) => {
  res.render('register', { title: 'Оформление' });
});

// router для вывода созданного pdf документа пользователем
router.get('/register/:filename', async (req, res, next) => {
  var filename = req.params.filename;
  var filePath = `./downloads/${filename}`;
  try {
    fs.readFile(filePath, function (err, data) {
      res.contentType('application/pdf');
      return res.send(data);
    });
  } catch (err) {
    console.log('our error: ', err);
  }
});

router.get('/doc', (req, res, next) => {
  res.render('doc', {
    title: 'DOC',
  });
});

// router для регистрации, оформления и создания pdf файла
router.post('/register', async (req, res) => {
  //res.setHeader('Content-type', 'application/pdf')
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const emailExist = await User.findOne({
    email: req.body.email,
  });
  if (emailExist) return res.status(400).send('Email already exists');

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
    org: req.body.org,
    inn: req.body.inn,
    kpp: req.body.kpp,
    ogrn: req.body.ogrn,
    ua: req.body.ua,
    phone: req.body.phone,
  });
  try {
    async function convert() {
      const compile = async function (templateName, data) {
        const filePath = path.join(
          process.cwd(),
          'views',
          `${templateName}.hbs`,
        );
        const html = await fs.readFile(filePath, 'utf-8');
        return hbs.compile(html)(user);
      };

      try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const content = await compile('doc', User);
        await page.setContent(content);
        await page.emulateMediaType('screen');
        await page.pdf({
          path: `./downloads/${req.body.email}${todays_date.getDate()}.pdf`,
          format: 'A4',
          printBackground: true,
        });
        console.log('done');
        await browser.close();
      } catch (err) {
        console.log('our error: ', err);
      }
    }
    const savedUser = await user.save();
    await convert();
    return res.redirect(
      `/api/user/register/${user.email}${todays_date.getDate()}.pdf`,
    );
  } catch (err) {
    res.status(400).send(err);
  }
});

// router для авторизации пользователя
router.post('/login', async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) return res.status(400).send('Email is not found');
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('Invalid password');

  const token = await jwt.sign(
    {
      _id: user._id,
    },
    process.env.TOKEN_SECRET,
  );

  res.setHeader('auth-token', token);
  res.redirect(`/api/user/login/${user._id}`);
  // res.render('test', {
  //   name: user.name,
  //   inn: user.inn,
  //   org: user.org,
  //   kpp: user.kpp,
  //   ogrn: user.ogrn,
  //   ua: user.ua,
  //   phone: user.phone,
  // })
});

module.exports = router;
