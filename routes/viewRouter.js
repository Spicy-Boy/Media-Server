const router = require("express").Router();

const {
    redirectLogin,
    redirectIfLoggedIn
 } = require("../middlewares/authMiddleware");

const {
    renderHomePage,
    renderLoginPage,
    renderSuicuneDeliveryPage
} = require("../controllers/viewController");

router.get("/", redirectLogin, renderHomePage);

router.get("/login", redirectIfLoggedIn, renderLoginPage);

router.get("/mail", redirectLogin, renderSuicuneDeliveryPage);

module.exports = router;
