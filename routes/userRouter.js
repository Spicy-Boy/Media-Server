const router = require('express').Router()

const {
    createUser,
    verifyPassword,
    updatePassword
} = require('../controllers/userController')

// requires you to be logged in
const authMiddleware = require('../middlewares/authMiddleware');

// localhost:3001/user/createUser
router.post('/createUser', createUser)

// localhost:3001/user/verifyPassword
router.post('/verifyPassword', verifyPassword)

// localhost:3001/user/updatePassword
router.put('/updatePassword', authMiddleware, updatePassword)

module.exports = router