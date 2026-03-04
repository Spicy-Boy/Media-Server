const router = require("express").Router();

const {
    callDeepSeek,
    callAaronAi,
    testAi
} = require("../../controllers/aiController");

const {
    updateUserPermissionsAndFiles,
    validateLogin,
    validateAdminAuth,
    validateIsCurator,
    validateIsUploader,
 } = require("../../middlewares/authRemaster");

// router.use(validateLogin);

router.post("/callDeepSeek", callDeepSeek);

router.post("/callAaronAI", callAaronAi);

// router.use(updateUserPermissionsAndFiles);

router.get("/test", validateAdminAuth, testAi);

module.exports = router;