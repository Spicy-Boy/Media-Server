const router = require("express").Router();

const {
    redirectLogin,
    redirectIfLoggedIn
 } = require("../middlewares/authMiddleware");

const {
    renderHomePage,
    renderLoginPage,
    renderSuicuneDeliveryPage,
    renderSuicuneDeliveryPageBusboy,
    renderSuicuneDeliveryPageSimpleBusboy
} = require("../controllers/viewController");

router.get("/", redirectLogin, renderHomePage);

router.get("/login", redirectIfLoggedIn, renderLoginPage);

router.get("/mail", redirectLogin, renderSuicuneDeliveryPage);

router.get("/busboy", redirectLogin, renderSuicuneDeliveryPageBusboy)

router.get("/simpleBusboy", redirectLogin, renderSuicuneDeliveryPageSimpleBusboy)


module.exports = router;
