const router = require("express").Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
    renderHomePage,
    renderLoginPage
} = require("../controllers/viewController");

router.get("/", authMiddleware, renderHomePage);

router.get("/login", renderLoginPage);

module.exports = router;
