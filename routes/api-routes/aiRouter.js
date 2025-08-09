const router = require("express").Router();

const {
    callDeepSeek,
    testAi
} = require("../../controllers/aiController");

const {
    updateUserPermissionsAndFiles,
    validateLogin,
    validateAdminAuth,
    validateIsCurator,
    validateIsUploader,
 } = require("../../middlewares/authRemaster");

router.use(validateLogin);

router.post("/callDeepSeek", callDeepSeek);

router.use(updateUserPermissionsAndFiles);

router.get("/test", validateAdminAuth, testAi);

module.exports = router;