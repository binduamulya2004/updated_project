const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const authenticate = require('../middleware/jwt/authenticate');
const jwtAuth = require('../middleware/jwt/jwtAuth');
const multer = require('multer');
const mailController=require('../controllers/mailControllers');
const checkRole = require('../middleware/jwt/checkRole');

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });



// router.post('/signup', authController.signup);
// router.post('/login', authController.login);
// router.post('/refresh-token', authController.refreshToken);
// router.post('/logout', authController.logout);
// router.get('/user-details', authenticate, authController.getUserDetails);
// router.post('/upload-profile-photo', jwtAuth, upload.single('profile_pic'), authController.uploadProfilePhoto);
// router.get('/vendors/count', authenticate, authController.getVendorCount);
// router.get('/products', authenticate, authController.getProducts);

//add product
router.post('/products', authenticate, checkRole(['admin','manager']),upload.single('profile_pic'), authController.addProduct);
router.get('/categories', authenticate, authController.getCategories); // New route for retrieving categories
router.get('/vendors', authenticate, authController.getVendors); // New route for retrieving vendors
router.post('/upload-product-image', upload.single('product_image'), authController.uploadProductImage);

//in table edit
router.put('/products/:productId',authenticate , checkRole(['admin','manager']), upload.single('product_image'), authController.updateProduct);

//delete product
router.delete('/products/:productId', authenticate, checkRole(['admin','manager']),authController.deleteProduct);


//cart routes
router.post('/move-to-cart',authenticate,checkRole(['admin','user']), authController.moveToCart);
router.get('/cart', authenticate, checkRole(['admin','user']),authController.getCartItems);
router.post('/cart/update', authenticate, authController.updateCartItemQuantity);
router.delete('/delete-cart-item/:cartId', authenticate, authController.deleteCartItem);

//upload files 

router.post('/upload', authenticate,checkRole(['admin']),upload.single('file'), authController.uploadFile);
// Route to get the list of uploaded files
router.get('/files',authenticate,authController.getUploadedFiles);
router.post('/download',authenticate, authController.downloadFiles);



// Import routes
router.post('/import', authenticate,checkRole(['admin']), upload.single('file'), authController.importFile);



router.post('/forgot-password',mailController.forgotPassword);

router.post('/reset-password/:id/:accessToken',mailController.resetPassword);


router.put('/update-cart-quantity', authenticate, authController.updateCartQty)


router.get('/retrieve-files',authenticate,authController.retrieveFiles);



router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/user-details', authenticate, authController.getUserDetails);
router.post('/upload-profile-photo', jwtAuth, upload.single('profile_pic'), authController.uploadProfilePhoto);
router.get('/vendors/count', authenticate, authController.getVendorCount);
router.get('/products', authenticate, authController.getProducts);



module.exports = router;

