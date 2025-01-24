// controllers/foods.js

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// INDEX
router.get('/', async (req, res) => {
    try {
        const userId = req.session.user._id
        const user = await User.findById(userId).select('+pantry')
        console.log(user, 'user')
        res.render('foods/index.ejs', { pantry: user.pantry, id: userId });
    } catch (error) {
        console.error('Error loading pantry:', error);
        res.status(500).send('Error loading pantry');
    }

});


// NEW
router.get('/new', async (req, res) => {
    try {

        res.render('foods/new');// Render the form with the "ID"
    } catch (error) {
        console.error('Error rendering new pantry form:', error);
        res.status(500).send('Error loading the form');
    }
});




//create
router.post('/', async (req, res) => {
    try {
        const userId = req.session.user._id


        const user = await User.findById(userId) // Find the user by ID

        user.pantry.push(req.body)
        await user.save();

        // Redirect to the pantry list
        res.redirect(`/users/${userId}/foods`);

    } catch (error) {
        console.error('Error creating new pantry item:', error);
        res.status(500).send('Error creating pantry item');
    }
});

//delete
router.delete('/:itemId', async (req, res) => {
    try {
        const userId = req.session.user._id
        const {  itemId } = req.params;
        const user = await User.findById(userId)
        const foodItemIndex = user.pantry.findIndex(food => food._id.toString() === itemId)
        // Verify the user and delete the item
        user.pantry.splice(foodItemIndex,1)
        await user.save()
        // Redirect to the pantry index
        res.redirect(`/users/${userId}/foods`);
    } catch (error) {
        console.error('Error deleting food item:', error);

        // Redirect home on error
        res.redirect('/');
    }
});

//show
router.get('/:itemId', async (req,res) => {
    try {
        const userId = req.session.user._id
        const { itemId } = req.params;
        const user = await User.findById(userId);
    console.log(itemId)
        const foodItem = user.pantry.find(food => food._id.toString() === itemId)
        console.log(foodItem)
    res.render('foods/show',{foodItem,user})

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server internal error")

    }
        // Render the show.ejs view...item data
  
});

//update
router.put('/:itemId', async (req, res) => {
    try {
        const userId = req.session.user._id
        const { itemId } = req.params;
        const { name, description } = req.body;
        const user = await User.findById(userId)
        const foodItem = user.pantry.find(food => food._id.toString() === itemId)
        // Look up the user by ID
      ;
foodItem.name = name
foodItem.description = description
await user.save()
        // Redirect back to the pantry index view
     res.redirect(`users/${userId}/foods`)
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});
//edit
router.get('/:itemId/edit', async (req, res) => {
    try {
      
        const userId = req.session.user._id
        const { itemId } = req.params;
        const user = await User.findById(userId);
    console.log(itemId)
        const foodItem = user.pantry.find(food => food._id.toString() === itemId)
        console.log(foodItem)
    res.render('foods/edit',{foodItem,user})

        
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});


module.exports = router;
