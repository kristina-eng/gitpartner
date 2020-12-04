const express = require('express');
const app = express();
var hbs = require('hbs');
const path = require('path');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const aboutUsRoute = require('./routes/aboutUs');
const newsRoute = require('./routes/news');
const ourServicesRoute = require('./routes/ourServices');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const PORT = process.env.PORT || 3001;


// подключение к базе данных
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('connected to db!'),
);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname));
app.use(methodOverride('_method'));

// использование routes
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/aboutUs', aboutUsRoute);
app.use('/api/news', newsRoute);
app.use('/api/ourServices', ourServicesRoute);

// рендер главной страницы
app.get('/', (req, res) => {
  res.render('index');
});

app.listen(PORT, () => console.log('Server is running'));
