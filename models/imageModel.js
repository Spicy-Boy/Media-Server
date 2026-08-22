const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const imageSchema = new mongoose.Schema(
    {
        name: { //file name
            type: String,
            required: true
        },
        username: { //name of person that uploaded image
            type: String,
            required: true,
        },
        imgId: {
            type: String,
            required: true,
            default: uuidv4
        },
        imgSize: Number, //in bytes
        imgWidth: Number,
        imgHeight: Number,
        imgDate: { //the original lastModified date of uploaded file converted to a Date
            //allows one to organize photos by date taken.. obviously not perfect because the user may manipulate the file before uploading
            type: Date,
            required: true
        },
        dateUploaded: { //date that the image was actually uploaded to the server.. don't get confused!
            type: Date,
            required: true,
            default: Date.now
        },
        imgFileType: String,
        locations:[ //a list of locations to keep track of all pile paths a file will go through
            {
                location: String, //a file path 
                dateAdded: { 
                    type: Date,
                    default: Date.now
                },
            }
        ],
        //file locations are saved just in case the .env mail delivery location changes, or the file needs to move, or some other disaster. This keeps a record of where the file was uploaded originally to aid in future recovery efforts
        hasThumbnail: {
            type: Boolean, //set to true once the thumbnail is complete
            default: false,
        },
        thumbnailLocation: String, //a file path to original location of thumbnail upon first creation

        //INCLUDE GALLERY IDs!!
        
    }
)

const Image = mongoose.model('Image', imageSchema)

module.exports = Image;