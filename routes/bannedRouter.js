const router = require('express').Router();

const {
    addIP,
    addPath
} = require('../controllers/bannedController')

const {
    adminAuth,
    validateLogin
 } = require("../middlewares/authMiddleware");


router.post("/api/banIP", validateLogin, adminAuth, addIp);

router.post("/api/banPath", validateLogin, adminAuth, addPath);

module.exports = router;