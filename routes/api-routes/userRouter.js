const router = require('express').Router()

const {
    loginUser,
    logoutUser,
    createNewUser,
    sendUsersToWebpage,
    changeUserPassword,
    toggleIsFrozen,
    toggleIsUploader,
    toggleIsCurator
} = require('../../controllers/userController')

// requires you to be logged in
const {
    redirectLogin,
    adminAuth
 } = require("../../middlewares/authMiddleware");

// localhost:PORT/api/user/login
router.post('/login', loginUser);

router.get('/logout', logoutUser);

router.post("/createNewUser", redirectLogin, adminAuth, createNewUser);

router.get("/sendUsersToWebpage", redirectLogin, adminAuth, sendUsersToWebpage);

router.post("/changeUserPassword/:username", redirectLogin, adminAuth, changeUserPassword);

router.post("/toggleFrozen/:username", redirectLogin, adminAuth, toggleIsFrozen);
router.post("/toggleCurator/:username", redirectLogin, adminAuth, toggleIsCurator);
router.post("/toggleUploader/:username", redirectLogin, adminAuth, toggleIsUploader);

module.exports = router