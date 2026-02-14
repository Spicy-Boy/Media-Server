const router = require("express").Router();
const path = require("path");

const {
    validateLoginWithRedirect,
    validateLoginConditionallyForFile,
    updateUserPermissionsAndFiles,
    validateAdminAuth,
    validateIsCurator,
    validateIsUploader,
    validateLogin,
} = require("../middlewares/authRemaster");

const {
    renderHomePage,
    renderLoginPage,
    renderUserIndexPage,
    renderIndividualFilePage,
    renderAdminFunPanel,
    renderUserManagementPanel,
    renderBasicImageHub,
    renderBasicGallery
} = require("../controllers/viewController");

router.get("/login", renderLoginPage);

router.get("/u/:username/:fileId", validateLoginConditionallyForFile/* IF FILE IS PUBLIC ACCESS, STRANGER ON THE INTERNET CAN STILL PASS AUTH */, renderIndividualFilePage);

/* # $ # $ # LOGIN VALIDATION # $ # $ # */
/* (login required below vvv) */
// router.use(validateLoginWithRedirect);

// router.get("/", validateLoginWithRedirect, renderHomePage);

//TEMP:
router.get("/", validateLoginWithRedirect, updateUserPermissionsAndFiles, validateIsUploader, renderUserIndexPage);

router.get("/home", validateLoginWithRedirect, renderHomePage);

/* # $ # $ # PERMISSIONS VALIDATION # $ # $ # */
/* (special permissions required below vvv) */
// router.use(updateUserPermissionsAndFiles);

// vv if no :username parameter, send to session page
router.get("/u", validateLoginWithRedirect, updateUserPermissionsAndFiles, validateIsUploader, renderUserIndexPage);
router.get("/u/:username", validateLoginWithRedirect, updateUserPermissionsAndFiles, validateIsUploader, renderUserIndexPage);

router.get("/i/:username", validateLoginWithRedirect, updateUserPermissionsAndFiles, validateIsUploader, renderBasicImageHub);
router.get("/i", validateLoginWithRedirect, updateUserPermissionsAndFiles, validateIsUploader, renderBasicImageHub);

router.get("/g/:galleryId", validateLoginWithRedirect, updateUserPermissionsAndFiles, validateIsUploader, renderBasicGallery);

router.get("/ai", validateLoginWithRedirect, updateUserPermissionsAndFiles, validateIsUploader, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/html/aiQueryPage.html"));
});

//obscures my pathing for github
let userManagementPath = process.env.USER_MANAGEMENT_PATH;
let genericAdminPath = process.env.GENERIC_ADMIN_PATH;

router.get(genericAdminPath, validateLoginWithRedirect, updateUserPermissionsAndFiles, validateAdminAuth, renderAdminFunPanel);
router.get(userManagementPath, validateLoginWithRedirect, updateUserPermissionsAndFiles, validateAdminAuth, renderUserManagementPanel);

//*^*^*^* TEST ROUTES *^*^*^*
router.get("/testvideo", validateLoginWithRedirect, (req, res) => {
    return res.render("video-hosting-pages/test-video-streaming");
});
//^*^*^**^*^*^*^**^*^*^*^*^*^

module.exports = router;
