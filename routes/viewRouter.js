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

//vv using the beforeSemicolon test
router.get("/busboy", redirectLogin, renderSuicuneDeliveryPageBusboy)

//vv using the simpleUploadLogic rewrite
router.get("/simpleBusboy", redirectLogin, renderSuicuneDeliveryPageSimpleBusboy)


module.exports = router;
