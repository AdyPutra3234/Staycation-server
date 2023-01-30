const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { upload, uploadMultiple } = require('../midleware/multer');
const auth = require('../midleware/auth');

router.get('/login', adminController.viewLogin);
router.post('/login', adminController.onLogin);

router.use(auth);

router.get('/logout', adminController.onLogout);

router.get('/dashboard', adminController.viewDashboard);

// end point Catgeory
router.get('/category', adminController.viewCategory);
router.post('/category', adminController.addCategory);
router.put('/category', adminController.editCategory);
router.delete('/category/:id', adminController.deleteCategory);

// end point Category Feature
router.get('/feature_category', adminController.viewFeatureCategory);
router.post('/feature_category', upload, adminController.addFeatureCategory);
router.put('/feature_category', upload, adminController.editFeatureCategory);
router.delete('/feature_category/:id', adminController.deleteFeatureCategory);

// end point Bank
router.get('/bank', adminController.viewBank);
router.post('/bank',upload, adminController.addBank);
router.put('/bank',upload, adminController.editBank);
router.delete('/bank/:id', adminController.deleteBank);

// end point Item
router.get('/item', adminController.viewItem);
router.post('/item', uploadMultiple, adminController.addItem);
router.get('/item/:id', adminController.viewEditItem);
router.put('/item/:id', uploadMultiple, adminController.editItem);
router.delete('/item/:id', adminController.deleteItem);

// end point Images Item
router.get('/item/:id/images', adminController.viewItemImages);
router.post('/item/:id/images', uploadMultiple, adminController.addImagesItem);
router.delete('/item/:itemId/images/:imageId', adminController.deleteImageItem);

// end point detail Item
router.get('/item/detail/:id', adminController.viewDetailItem);

// end point feature
router.post('/item/:id/feature', upload, adminController.addFeatureItem);
router.put('/item/:itemId/feature/:featureId',upload, adminController.editFeature);
router.delete('/item/:itemId/feature/:featureId', adminController.deleteFeature);

// end point activity
router.post('/item/:id/activity', upload, adminController.addItemActivity);
router.put('/item/:itemId/activity/:activityId',upload, adminController.editActivity);
router.delete('/item/:itemId/activity/:activityId', adminController.deleteActivity);


// end point Booking
router.get('/booking', adminController.viewBooking);
router.get('/booking/:id', adminController.viewDetailBooking);
router.put('/booking/:id/accept', adminController.onBookingAcception);
router.put('/booking/:id/reject', adminController.onBookingRejection);

module.exports = router;