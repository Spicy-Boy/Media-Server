const router = require('express').Router()

const {
    loginUser,
    logoutUser,
    createNewUser
} = require('../controllers/userController')

// requires you to be logged in
const {
    redirectLogin,
    adminAuth
 } = require("../middlewares/authMiddleware");

// localhost:PORT/api/user/login
router.post('/login', loginUser);

router.get('/logout', logoutUser);

router.post("/createNewUser", redirectLogin, adminAuth, createNewUser);

module.exports = router