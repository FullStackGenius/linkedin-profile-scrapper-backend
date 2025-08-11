const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const linkedinScrapingController = require('../controllers/linkedinScrapingController');
const scrapeController = require('../controllers/scrapeController');
const phantombusterScraping = require('../controllers/phantombusterScraping');
const authenticateToken = require('../middlewares/authMiddleware');
const { registerValidation ,loginValidation } = require('../validators/authValidator');
const validate = require('../middlewares/validationHandler');
//router.post('/register', authController.register);
router.post('/register', registerValidation, authController.register);
router.post('/login',  loginValidation, authController.login);
router.get('/profile', authenticateToken, authController.profile);
router.post('/update-profile', authenticateToken, authController.updateProfile);

//router.post('/scrapeLinkedIn',linkedinScrapingController.scrapeLinkedIn);
router.post('/scrapeBrightdata',authenticateToken,scrapeController.scrapeLinkedInKeywords);
router.post('/scrapeLinkedInDataInsert',authenticateToken,scrapeController.scrapeLinkedInDataInsert);
router.get('/getAllLinkedinProfiles',authenticateToken,scrapeController.getAllLinkedinProfiles);
router.post('/google-login', authController.googleLogin);
router.post('/phantombuster-scraping',authenticateToken, phantombusterScraping.phantombusterScraping);
router.get('/linkedin-profiles-data',authenticateToken, phantombusterScraping.LinkedinProfilesData);

// router.post('/scrapeLinkedIn',authenticateToken,linkedinScrapingController.scrapeLinkedIn);
router.post('/test123',scrapeController.test123);
module.exports = router;
