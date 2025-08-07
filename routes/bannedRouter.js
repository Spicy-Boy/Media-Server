const router = require('express').Router();

const {
    addIP,
    addPath
} = require('../controllers/bannedController')

const {
    adminAuth,
    validateLogin
 } = require("../middlewares/authMiddleware");


router.post("/banIP", validateLogin, adminAuth, addIP);

router.post("/banPath", validateLogin, adminAuth, addPath);

module.exports = router;