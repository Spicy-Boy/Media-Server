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

// OLD MAIL ROUTE vv using multer (deprecated)
// router.get("/mail", redirectLogin, renderSuicuneDeliveryPage);
// vv NEW mail route using an xmlhttprequest frontend and busboy writestream backend
router.get("/mail", redirectLogin, renderSuicuneDeliveryPageSimpleBusboy)
//^^ using the simpleUploadLogic rewrite

//vv DEPRECATED UPLOAD ROUTE using the beforeSemicolon test
// router.get("/busboy", redirectLogin, renderSuicuneDeliveryPageBusboy)

module.exports = router;
