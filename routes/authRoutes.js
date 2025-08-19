const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const phantombusterScraping = require('../controllers/phantombusterScraping');
const authenticateToken = require('../middlewares/authMiddleware');
const { registerValidation ,loginValidation } = require('../validators/authValidator');
const validate = require('../middlewares/validationHandler');

router.post('/register', registerValidation, authController.register);
router.post('/login',  loginValidation, authController.login);
router.get('/profile', authenticateToken, authController.profile);
router.post('/update-profile', authenticateToken, authController.updateProfile);


router.post('/google-login', authController.googleLogin);
router.post('/phantombuster-scraping', phantombusterScraping.phantombusterScraping);
router.get('/linkedin-profiles-data', phantombusterScraping.LinkedinProfilesData);


module.exports = router;
