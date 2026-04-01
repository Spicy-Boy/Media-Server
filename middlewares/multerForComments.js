const multer = require("multer");
const fs = require("fs");
const path = require("path");

//MULTER middleware
//used for comment uploading, simple as!!!
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

const noteStorage = multer.diskStorage({
    destination: (req, file, cb) =>
    {
        let noteImgPath = process.env.MAIL_DELIVERY_LOCATION+"/"+req.params.username+"_files/note_files/";

        fs.mkdirSync(noteImgPath, { recursive: true });

        cb(null, noteImgPath);
    },
    filename: (req, file, cb) =>
    {
        cb(null, file.originalname);
    }
});

const uploadNoteImage = multer({storage: noteStorage});

module.exports = {
    uploadCommentImage,
    uploadNoteImage
};