const upload = require("../../middlewares/multer");
const router = require("express").Router();

const {
    createNewDonation,
    getDonations
} = require("../../controllers/donationController");

const {
    redirectLogin,
    adminAuth
 } = require("../../middlewares/authMiddleware");

router.post("/createNewDonation", redirectLogin, adminAuth, upload.single('uploaded_file'), createNewDonation);

router.get("/getDonations", getDonations);

module.exports = router;