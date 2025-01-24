const express = require('express');
const User = require('../models/user');
const router = express.Router();
//induces 
// Index
router.get('/', async  (req, res) => {
    try {
        const userId = req.session.user._id
        const user = await User.findById(userId).select('+pantry')
        console.log(user, 'user')
        res.render('foods/index.ejs', {pantry:user.pantry, id: userId });
    } catch (error){
        console.error('Error loading pantry:', error);
        res.status(500).send('Error loading pantry'); 
    }
   
});



// new
router.get('/new', async (req, res) => {
    try {

        res.render('foods/new');// Render the form with the ID
    } catch (error) {
        console.error('Error rendering new pantry form:', error);
        res.status(500).send('Error loading the form');
    }
});

// Delete 
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
        console.error('Error deleting Pantry item:', error);

        // Redirect home on error
        res.redirect('/');
    }
});

// update (this route gave me a hard time stack overflow and chatgpt helped me)
router.put('/:itemId', async (req, res) => {
    try {
        const userId = req.session.user?._id;
        const { itemId } = req.params;
        const { name, description } = req.body;

        // Validate user session
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        // Validate input
        if (!name || !description) {
            return res.status(400).json({ error: 'Name and description are required' });
        }

        const user = await User.findById(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const foodItem = user.pantry.find(food => food._id.toString() === itemId);

        // Check if food item exists
        if (!foodItem) {
            return res.status(404).json({ error: 'Pantry item not found' });
        }

        // Update the food item
        foodItem.name = name;
        foodItem.description = description;

        await user.save();

        // Redirect back to the pantry index view
        res.redirect(`/users/${userId}/foods`);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
});


// Create 
router.post('/', async (req, res) => {
    try {
        const userId = req.session.user._id

        // Save the new pantry item
        const user = await User.findById(userId)

        user.pantry.push(req.body)
        await user.save();

        // // Redirect to the pantry list
        res.redirect(`/users/${userId}/foods`);

    } catch (error) {
        console.error('Error creating new pantry item:', error);
        res.status(500).send('Error creating pantry item');
    }
});





       
  







// Edit Route
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
//Show Route
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
       
  
});

module.exports = router;
