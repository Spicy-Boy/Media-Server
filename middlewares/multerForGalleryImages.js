const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try
        {
            //path is image drive -> username folder "[username]_images"
            //ex: public/images/aaron_images/happy.png
            let imagePath = process.env.IMAGE_DELIVERY_LOCATION+"/"+req.session.activeUser.username+"_images/"

            fs.mkdirSync(imagePath, { recursive: true });

            cb(null, imagePath);
        }
        catch (error)
        {
            console.log('Multer image upload failed in multerForGallery middleware:',error);
            cb(new Error("FAILED - couldn't create upload directory."), null);
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

//chat gpt vvv
const fileFilter = (req, file, cb) => 
{
    // const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|mkv/;
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const mimeType = allowedTypes.test(file.mimetype.toLowerCase());
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extName) 
    {
        cb(null, true);
    } 
    else 
    {
        cb(new Error("FAILED - not image or video file"), false); 
    }
};

const uploadImageForGalleryWithMulter = multer({storage, fileFilter});

module.exports = uploadImageForGalleryWithMulter;