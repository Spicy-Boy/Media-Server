const router = require('express').Router()

const {
    loginUser,
    logoutUser
} = require('../controllers/userController')

// requires you to be logged in
const authMiddleware = require('../middlewares/authMiddleware');

// localhost:PORT/api/user/loginUser
router.post('/login', loginUser);

router.post('/logout', logoutUser)

module.exports = router