const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

const gallerySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        galleryDescription: String,
        galleryId: {
            type: String,
            required: true,
            default: uuidv4
        },
        // *** vvv PERMISSIONS ***
        creator: String, //match the username of OG creator
        usersPermittedToUpload: [ //list of users that can also upload files
            {
                additionalUploader: String,
                canEdit: Boolean, //if true, user can also edit descriptions, delete files, and do other stuff
            }
        ],
        // *** ^^^ PERMISSIONS ***
        sectionsByModifiedDate: [ //a list of the days containing files (sorted by file's modified date)
            {
                sectionDate: { //truncated to only day, month, year
                    type: Date,
                    required: true,
                },
                sectionTitle: String, //a label for this gallery section
                sectionDescription: String, //extended description for this section
                sectionFeaturedImage: { //the featured image for this section
                    type: Schema.Types.ObjectId,
                    ref: "Image",
                },
                images: [ //sorted by image's date
                    {
                        _id: { 
                            type: Schema.Types.ObjectId,
                            ref: "Image",
                            required: true
                        },
                        imgDate: { //the file's internal modified date as Date object (used for sorting within each dated gallery section)
                            type: Date,
                            required: true
                        },
                        imgUploader: String,
                        thumbnailLocation: String, //I guess we can store this here so thumbnails can be displayed without needing to query the img database
                        listed: Boolean, //if false, don't show in gallery
                        alternativeTitle: String, //to be displayed instead of literal filename
                        imgDescription: String,
                    }
                ],
                featuredImage: { //the featured image of the gallery
                    type: Schema.Types.ObjectId,
                    ref: "Image",
                }
            }
        ],
        daysByUploadedDate: [
            {

            }
        ],

    }
);

const Gallery = mongoose.model('Gallery', gallerySchema)

module.exports = Gallery;