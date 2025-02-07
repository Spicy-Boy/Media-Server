const router = require("express").Router();

const {
    callDeepSeek,
    testAi
} = require("../controllers/aiController");

const { //import auth
    redirectLogin,
    adminAuth
} = require("../middlewares/authMiddleware");

router.post("/callDeepSeek", callDeepSeek);
router.get("/test", testAi);

module.exports = router;