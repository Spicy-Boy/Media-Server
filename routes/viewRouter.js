const router = require("express").Router();
const path = require("path");

const {
    redirectLogin,
    redirectIfLoggedIn,
    redirectLoginConditionally,
    adminAuth
 } = require("../middlewares/authMiddleware");

const {
    renderHomePage,
    renderLoginPage,
    renderSuicuneDeliveryPage,
    renderSuicuneDeliveryPageBusboy,
    renderSuicuneDeliveryPageSimpleBusboy,
    renderUserIndexPage,
    renderIndividualFilePage,
    renderAdminFunPanel
} = require("../controllers/viewController");

const {
    attachUserObjectToSession
} = require("../controllers/userController");

//homepage isn't done yet! vv TODO
// router.get("/", redirectLogin, renderHomePage);
router.get("/", redirectLogin, attachUserObjectToSession, renderUserIndexPage);

router.get("/login", redirectIfLoggedIn, renderLoginPage);

/* USER PORTAL/USER INDEX */
// vv /u/ stands for user, :username is the username parameter for each individual user's index page
// :fielId is the unique file uuid assigned to each file
router.get("/u/:username/:fileId", redirectLoginConditionally/* IF FILE IS PUBLIC ACCESS, STRANGER ON THE INTERNET CAN STILL PASS AUTH */, attachUserObjectToSession, renderIndividualFilePage);
router.get("/u/:username", redirectLogin, attachUserObjectToSession, renderUserIndexPage);
// vv if no :username parameter, send to session page
router.get("/u", redirectLogin, attachUserObjectToSession, renderUserIndexPage);

router.get("/cavern", redirectLogin, adminAuth, renderAdminFunPanel);

router.get("/ai", redirectLogin, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/aiQueryPage.html"));
});

// OLD MAIL ROUTE vv using multer (deprecated)
// router.get("/mail", redirectLogin, renderSuicuneDeliveryPage);
// vv NEW mail route using an xmlhttprequest frontend and busboy writestream backend
// router.get("/mail", redirectLogin, renderSuicuneDeliveryPageSimpleBusboy)
//^^ using the simpleUploadLogic rewrite

//vv DEPRECATED UPLOAD ROUTE using the beforeSemicolon test
// router.get("/busboy", redirectLogin, renderSuicuneDeliveryPageBusboy)

module.exports = router;
