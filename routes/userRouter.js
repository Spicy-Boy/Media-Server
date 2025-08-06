const router = require('express').Router()

const {
    loginUser,
    logoutUser,
    createNewUser,
    sendUsersToWebpage,
    changeUserPassword
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

router.get("/sendUsersToWebpage", redirectLogin, adminAuth, sendUsersToWebpage);

router.post("/changeUserPassword/:username", redirectLogin, adminAuth, changeUserPassword);

module.exports = router