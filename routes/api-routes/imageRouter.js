const router = require("express").Router();

const uploadImageForGalleryWithMulter = require("../../middlewares/multerForGalleryImages");

const {
    updateUserPermissionsAndFiles,
    validateLogin,
    validateAdminAuth,
    validateIsCurator,
    validateIsUploader,
    validateLoginConditionallyForFile,
} = require("../../middlewares/authRemaster");

const {
    createImageDatabaseEntry,
    getImagesByUsername,
    sendImageById,
    createGalleryFromMongoIds
} = require("../../controllers/imageController");

router.post("/uploadImageWithMulter", validateLogin, updateUserPermissionsAndFiles, validateIsUploader,
(req, res, next) => {
    uploadImageForGalleryWithMulter.single("uploaded_file")(req, res, (error) => {
      if (error) {
        return res.status(400).json({
          success: false,
          errorMsg: error.message
        });
      }
      next(); // continue to next middleware if no error
    })
}
, createImageDatabaseEntry);

// /api/images/getImagesByUsername/:username
router.get("/getImagesByUsername/:username", validateLogin, updateUserPermissionsAndFiles, getImagesByUsername);

router.get("/sendImageById/:imageId", validateLogin, sendImageById);

router.post("/createGalleryFromMongoIds", validateLogin, createGalleryFromMongoIds);

module.exports = router;