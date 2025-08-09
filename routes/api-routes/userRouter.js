const router = require('express').Router()

const {
    createNewUser,
    sendUsersToWebpage,
    changeUserPassword,
    toggleIsFrozen,
    toggleIsUploader,
    toggleIsCurator
} = require('../../controllers/userController')


const {
    loginAndAttachUserToSession,
    logoutUser,
    updateUserPermissionsAndFiles,
    validateLogin,
    validateAdminAuth,
    validateIsCurator,
    validateIsUploader,
 } = require("../../middlewares/authRemaster");

// localhost:PORT/api/user/login
router.post('/login', loginAndAttachUserToSession);

router.get('/logout', logoutUser);

/* LOGIN AND PERMISSIONS VALIDATION BELOW THESE LINE!*/
router.use(validateLogin);
router.use(updateUserPermissionsAndFiles);

router.post("/createNewUser", validateAdminAuth, createNewUser);

router.get("/sendUsersToWebpage", validateAdminAuth, sendUsersToWebpage);

router.post("/changeUserPassword/:username", validateAdminAuth, changeUserPassword);

router.post("/toggleFrozen/:username", validateAdminAuth, toggleIsFrozen);
router.post("/toggleCurator/:username", validateAdminAuth, toggleIsCurator);
router.post("/toggleUploader/:username", validateAdminAuth, toggleIsUploader);

module.exports = router