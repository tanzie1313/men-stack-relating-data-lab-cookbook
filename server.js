const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const path = require('path');
const usersController = require('./controllers/users');

const authController = require('./controllers/auth.js');
const foodsController = require('./controllers/foods.js');





const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

const port = process.env.PORT ? process.env.PORT : '3010';

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);



// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));











app.use(passUserToView);
app.use('/auth', authController);
app.use(isSignedIn);
app.use('/users/:userId/foods', foodsController);
app.use('/users', usersController);
// app.use('/all_users', foodsController);
app.get('/', (req, res) => {
  res.render('index.ejs');
        user:req.session.user
});



app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});