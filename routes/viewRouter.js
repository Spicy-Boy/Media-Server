const router = require("express").Router();

const {
    redirectLogin
 } = require("../middlewares/authMiddleware");

const {
    renderHomePage,
    renderLoginPage
} = require("../controllers/viewController");

router.get("/", redirectLogin, renderHomePage);

router.get("/login", renderLoginPage);

module.exports = router;
