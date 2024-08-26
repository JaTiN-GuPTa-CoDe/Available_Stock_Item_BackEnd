const express = require('express');
const router = express.Router();
const shopOwnerController = require('../controllers/ShopOwnerController');

// Routes
router.post('/signup', shopOwnerController.shopOwnerSignup);
router.post('/login', shopOwnerController.shopOwnerLogin);
router.get('/logout', shopOwnerController.loggedOut);

module.exports = router;
