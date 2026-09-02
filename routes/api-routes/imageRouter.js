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
    sendImageByMongoId,
    createGalleryFromMongoIds,
    getGalleriesByUsername,
    getGalleryById,
    updateGalleryWithMongoIds
} = require("../../controllers/imageController");

router.post("/uploadImageWithMulter", validateLogin, updateUserPermissionsAndFiles, validateIsUploader,
(req, res, next) => {
    uploadImageForGalleryWithMulter.single("uploaded_file")(req, res, (error) => {
      if (error) {

        req.unpipe(); //stop piping the data, it was rejected
        req.resume(); //keep reading the data to finish the request, but it is no longer being saved

        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      next(); // continue to next middleware if no error
    })
}
, createImageDatabaseEntry);

router.get("/getImageByUuid"); TODOdahdh
router.get("/getImageByMongoId"); TODOadhadh
router.get("/getImagesByUsername"); TodoAHaha
router.get("/sendImageByUuid"); todoahahah
router.get("/sendImageByMongoId"); todoahagag

//Gallery routes:
router.get("/getGalleryById/:galleryId", validateLogin, updateUserPermissionsAndFiles, validateIsUploader, getGalleryById); //retrieve gallery object

router.get("/getGalleriesByUsername/:username", validateLogin, updateUserPermissionsAndFiles, validateIsUploader, getGalleriesByUsername); //get all galleries belonging to a user

// router.post("/createNewGallery", validateLogin, updateUserPermissionsAndFiles, validateIsUploader, createNewGallery); //create a new gallery under logged-in user

// router.post("/addImageToGalleryById/:galleryId", validateLogin, updateUserPermissionsAndFiles, validateIsUploader, addImageToGalleryById); //find gallery by its id and 

// router.get("/sendImageById/:imageId", validateLogin, sendImageById);

//OLD ROUTES vvv from first gallery prototypeWS

//get image vvv by its mongo assigned ID (_id)
router.get("/getByMID/:mongoId", validateLogin, sendImageByMongoId);


module.exports = router;