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
        galleryId: {
            type: String,
            required: true,
            default: uuidv4
        },
        creator: String,
        usersPermittedToUpload: [
            {
            creator: String,
            },
        ],
        days: [
            {
                date: {
                    type: Date,
                    required: true,
                },
                images: [
                    {
                        _id: { 
                            type: Schema.Types.ObjectId,
                            ref: "Image",
                            required: true
                        },
                        imgDate: { //the file's internal modified date, saved
                            type: Date,
                            required: true
                        }
                    }
                ],
                featuredImage: {
                    type: Schema.Types.ObjectId,
                    ref: "Image",
                },
                header: {
                    type: String
                }
            }
        ]

    }
);

const Gallery = mongoose.model('Gallery', gallerySchema)

module.exports = Gallery;