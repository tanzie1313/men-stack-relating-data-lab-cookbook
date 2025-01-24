const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user.js');
//get users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.render('users/index.ejs', { users });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// Show
router.get('/:userId', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      res.render('users/show.ejs', { user });
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });
iy
  module.exports = router;