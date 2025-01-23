// controllers/foods.js

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// INDEX
router.get('/', (req, res) => {
    res.render('foods/index.ejs');
  });
  

// NEW

module.exports = router;
