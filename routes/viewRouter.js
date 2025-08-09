const router = require("express").Router();
const path = require("path");

const {
    validateLoginWithRedirect,
    validateLoginConditionallyForFile,
    updateUserPermissionsAndFiles,
    validateAdminAuth,
    validateIsCurator,
    validateIsUploader,
} = require("../middlewares/authRemaster");

const {
    renderHomePage,
    renderLoginPage,
    renderUserIndexPage,
    renderIndividualFilePage,
    renderAdminFunPanel,
    renderUserManagementPanel
} = require("../controllers/viewController");

router.get("/login", renderLoginPage);

router.get("/u/:username/:fileId", validateLoginConditionallyForFile/* IF FILE IS PUBLIC ACCESS, STRANGER ON THE INTERNET CAN STILL PASS AUTH */, renderIndividualFilePage);

/* # $ # $ # LOGIN VALIDATION # $ # $ # */
/* (login required below vvv) */
router.use(validateLoginWithRedirect);

router.get("/", validateLoginWithRedirect, renderHomePage);
router.get("/home", validateLoginWithRedirect, renderHomePage);

/* # $ # $ # PERMISSIONS VALIDATION # $ # $ # */
/* (special permissions required below vvv) */
router.use(updateUserPermissionsAndFiles);

// vv if no :username parameter, send to session page
router.get("/u", validateIsUploader, renderUserIndexPage);
router.get("/u/:username", validateIsUploader, renderUserIndexPage);

router.get("/ai", validateIsUploader, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/aiQueryPage.html"));
});

router.get("/cavern", validateAdminAuth, renderAdminFunPanel);
router.get("/souls", validateAdminAuth, renderUserManagementPanel);

module.exports = router;
