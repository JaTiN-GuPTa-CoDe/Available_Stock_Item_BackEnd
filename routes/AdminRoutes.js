const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const upload = require('../utils/Multer');
const {Authorization}= require('../middleware/Authorization');

// Routes
router.post('/signup', adminController.adminSignup);
router.post('/login', adminController.adminLogin);

router.post('/addproduct', upload.single('imageUrl'),Authorization,adminController.addProduct);
router.get('/products', Authorization,adminController.getAllProducts);
router.get('/products/:id', Authorization,adminController.getProductById);
router.put('/updateproduct/:id', upload.single('imageUrl'),Authorization, adminController.updateProductById);
router.delete('/products/:id',Authorization, adminController.deleteProductById);

router.get('/getallshopowner', Authorization,adminController.getAllShopOwners);
router.get('/getshopowner/:id', Authorization,adminController.getShopOwnerById);
router.delete('/getshopowner/:id',Authorization, adminController.deleteShopOwner);
router.patch('/verifyshopowner/:shopOwnerId', Authorization,adminController.verifyShopOwner);
router.get('/logout', adminController.loggedOut);

module.exports = router;
