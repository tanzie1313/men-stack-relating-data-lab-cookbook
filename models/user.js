const { name } = require('ejs');
const mongoose = require('mongoose');

const foodSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});





const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pantry: [foodSchema], // array of food objects embedded in user
    
  
});

const User = mongoose.model('User', userSchema);

module.exports = User;
