// const upload = require("../../middlewares/multer");
const router = require("express").Router();

const {
    createNewDonation,
    getDonations
} = require("../../controllers/donationController");

const {
    validateLogin,
    updateUserPermissionsAndFiles,
    validateAdminAuth,
    validateIsCurator,
    validateIsUploader,
 } = require("../../middlewares/authRemaster");

router.get("/getDonations", getDonations);
 

/* # $ # $ # PERMISSIONS VALIDATION # $ # $ # */
/* (special permissions required below vvv) */
// router.use(updateUserPermissionsAndFiles);

// router.post("/createNewDonation", validateLogin, updateUserPermissionsAndFiles, validateAdminAuth, upload.single('uploaded_file'), createNewDonation);



module.exports = router;