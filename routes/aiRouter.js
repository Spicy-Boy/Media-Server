const router = require("express").Router();

const {
    callDeepSeek,
    testAi
} = require("../controllers/aiController");

const { //import auth
    redirectLogin,
    adminAuth
} = require("../middlewares/authMiddleware");

router.post("/callDeepSeek", redirectLogin, callDeepSeek);
router.get("/test", adminAuth, testAi);

module.exports = router;