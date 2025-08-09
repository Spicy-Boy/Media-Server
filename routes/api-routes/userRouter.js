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
// router.use(validateLogin);
// router.use(updateUserPermissionsAndFiles);

router.post("/createNewUser", validateLogin, updateUserPermissionsAndFiles, validateAdminAuth, createNewUser);

router.get("/sendUsersToWebpage", validateLogin, updateUserPermissionsAndFiles, validateAdminAuth, sendUsersToWebpage);

router.post("/changeUserPassword/:username", validateLogin, updateUserPermissionsAndFiles, validateAdminAuth, changeUserPassword);

router.post("/toggleFrozen/:username", validateLogin, updateUserPermissionsAndFiles, validateAdminAuth, toggleIsFrozen);
router.post("/toggleCurator/:username", validateLogin, updateUserPermissionsAndFiles, validateAdminAuth, toggleIsCurator);
router.post("/toggleUploader/:username", validateLogin, updateUserPermissionsAndFiles, validateAdminAuth, toggleIsUploader);

module.exports = router