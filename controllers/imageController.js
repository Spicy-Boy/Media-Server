const fs = require("fs");

const User = require("../models/userModel");
const Image = require("../models/imageModel");
const Gallery = require("../models/galleryModel");

const mongoose = require("mongoose");

const sharp = require('sharp');
const ExifParser = require('exif-parser');

async function getImagesByUsername(req, res)
{
    let username = req.params.username;

    try
    {
        const images = await Image.find({ username }).sort({ imgDate: 1 });

        res.status(200).send(images);
    }
    catch (error)
    {
        console.log('getImagesByUsername failed:',error);
        res.status(400).json({
          success: false,
          errorMsg: "Failed to retrieve images from server - internal error!"
        });
    }
}

async function sendImageById(req, res)
{
    let imgId = req.params.imageId

    try
    {
        const image = await Image.find({ imgId });

        res.status(200).send(image);
    }
    catch (error)
    {
        console.log('sendImagesById failed:',error);
        res.status(400).json({
          success: false,
          errorMsg: "Failed to retrieve image from server - internal error!"
        });
    }
}

//vv uses the mongoDB unique _id to find the right image document.. supposedly faster?
async function sendImageByMongoId(req, res)
{
    let mongoId = req.params.mongoId;

    try
    {
        const image = await Image.findById(mongoId);

        res.status(200).sendFile(process.env.IMAGE_DELIVERY_LOCATION+"/"+image.username+"_images/"+image.name);
    }
    catch (error)
    {
        console.log('sendImagesById failed:',error);
        res.status(400).json({
          success: false,
          errorMsg: "Failed to retrieve image from server (mongoId) - internal error!"
        });
    } 
}

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
// vv update many days later: I'm not sure I needed this at all
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
        console.error("Refering to modified date -> Failed to read EXIF data:", err);
        return false;                           // fallback
    }
}

//vv so named because it uses the mongoDB auto-generated img._id's to query the db instead of my own imgId UUIDs 
async function createGalleryFromMongoIds(req, res)
{
    try
    {
        let title = req.body.title;
        let creator = req.session.activeUser.username;
        let imageIds = req.body.imageIds;
        
        //this is chatgpt magic vvv db aggregation
        const groupedImages = await Image.aggregate([
            { $match: { _id: { $in: imageIds.map(id => new mongoose.Types.ObjectId(id)) } } },
            { $sort: { imgDate: 1 } }, //sort images oldest -> newest
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$imgDate" } }, //_id comes out as a Y/M/D format
                    images: { $push: "$_id" },
                    // featuredImage: { $first: "$_id" } // first image of the day
                }
            },
            { $sort: { _id: 1 } } // oldest to newest
        ]);

        const days = groupedImages.map(dayGroup => ({
            date: new Date(dayGroup._id), //_id is the Y/M/D format
            images: dayGroup.images
        }));

        const gallery = new Gallery({
            title,
            creator,
            days
        });

        // await gallery.save();

        res.status(201).json({success: true, gallery, errorMsg: "Successfully created gallery '"+title+"'"});

    }
    catch (error)
    {
        console.log('ERROR CREATING Gallery:',error);
        res.status(400).json({
          success: false,
          errorMsg: "Failed to create the gallery!"
        });
    }
}

module.exports = {
    createImageDatabaseEntry,
    getImagesByUsername,
    sendImageById,
    createGalleryFromMongoIds
};