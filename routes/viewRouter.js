const router = require("express").Router();

const {
    redirectLogin
 } = require("../middlewares/authMiddleware");

const {
    renderHomePage,
    renderLoginPage,
    renderSuicuneDeliveryPage
} = require("../controllers/viewController");

router.get("/", redirectLogin, renderHomePage);

router.get("/login", renderLoginPage);

router.get("/mail", redirectLogin, renderSuicuneDeliveryPage);

module.exports = router;
