const router = require('express').Router();

const {
    addIP,
    addPath
} = require('../../controllers/moderationController')

const {
    validateLogin,
    validateAdminAuth,
    updateUserPermissionsAndFiles,
    validateIsCurator,
    validateIsUploader,
 } = require("../../middlewares/authRemaster");

router.post("/banIP", validateLogin, updateUserPermissionsAndFiles, validateAdminAuth, addIP);

router.post("/banPath", validateLogin, updateUserPermissionsAndFiles, validateAdminAuth, addPath);

module.exports = router;