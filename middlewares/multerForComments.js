const multer = require("multer");
const fs = require("fs");
const path = require("path");

//MULTER middleware
//used for donation uploading, simple as!!!
const storage = multer.diskStorage({
    destination: (req, file, cb) =>
    {
        let commentImgPath = process.env.MAIL_DELIVERY_LOCATION+"/"+req.params.username+"_files/"+req.params.fileId+"/";

        //TESTER vv
        // console.log('MULTER ACTIVATING!');

        fs.mkdirSync(commentImgPath, { recursive: true });

        cb(null, commentImgPath);
    },
    filename: (req, file, cb) =>
    {
        cb(null, file.originalname);
    }
});

const uploadCommentImage = multer({storage: storage});

module.exports = uploadCommentImage;