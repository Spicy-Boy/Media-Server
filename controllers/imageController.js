const fs = require("fs");
const User = require("../models/userModel");
const Image = require("../models/imageModel")
const sharp = require('sharp');
const ExifParser = require('exif-parser');

async function createImageDatabaseEntry(req, res)
{
    try
    {
        const filePath = req.file.path;
        const fileName = req.file.originalname;
        const fileStats = fs.statSync(filePath);

        const metadata = await sharp(filePath).metadata();
        let width = metadata.width;
        let height = metadata.height;

        //TESTER vv 
        // console.log("created:",fileStats.birthtime);
        // console.log('modified:',fileStats.mtime);

        const lastModifiedDate = new Date(Number(req.body.lastModified));

        const fileBirthDate = getPhotoTakenDate(filePath) || lastModifiedDate;

        const newImage = new Image({
            name: fileName,
            username: req.body.username,
            imgSize: fileStats.size,
            imgWidth: width,
            imgHeight: height,
            imgDate: fileBirthDate,
            imgFileType: req.file.mimetype,
            location: filePath,
            username: req.session.activeUser.username
        });

        await newImage.save();

        res.status(201).json({
            success: true,
            errorMsg: "Upload Successful!"
        });
    }
    catch (error)
    {
        console.log('createImageDatabaseEntry failed:',error);
        res.status(400).json({
          success: false,
          errorMsg: "Failed to create database entry for upload. Duplicate file name? CONTACT ADMIN!"
        });
    }
}

// vv entirely chat gpt function, it is now 5:41 am Friday 9/19/25
function getPhotoTakenDate(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);      // Read the file into a buffer
        const parser = ExifParser.create(buffer);      // Create EXIF parser
        const result = parser.parse();                 // Parse EXIF data

        // DateTimeOriginal tag is the date photo was taken
        const timestamp = result.tags.DateTimeOriginal;

        if (timestamp) {
            return new Date(timestamp * 1000);        // Convert UNIX timestamp to JS Date
        } else {
            return false;                       // fallback to Jan 1, 1970
        }
    } catch (err) {
        console.error("Failed to read EXIF data:", err);
        return false;                           // fallback
    }
}

module.exports = {
    createImageDatabaseEntry
};