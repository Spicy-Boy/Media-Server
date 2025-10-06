const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');

/* OwO A gallery?!
** A gallery is an object that contains references to a set of images.
** Each gallery is a list of img objects that contain:
- image full file name
- path to image (using back end image serving route w/auth)
- image date of creation
- whether image is listed or not (only uploader (and admins?) can see unlisted images)
** Each gallery contains a list of authorized users
- only authorized users and admins will pass the auth and be able to request images from the gallery
**
### The gallery is presented to the user through its view, if a user is authorized to view it ###
*/

// const gallerySchema = new mongoose.Schema(
//     {
//         creator: { //reference uuid of user that created the gallery!
//             type: String,
//             required: true,
//             unique: true
//         },
//         title: String,
//         isPublic: { //NOT USED yet.. for public web sharing of galleries!
//             type: Boolean,
//             required: true,
//             default: false
//         },
//         password: { //password used to access gallery. If null, bypass
//             type: String,
//             required: true,
//             default: null
//         },
//         authorizedViewers: //can view gallery
//         [{
//             userId: { //uuid of a user authorized to view the gallery
//                 type: String,
//                 required: true,
//                 unique: true
//             }
            
//         }],
//         authorizedContributors:  //can view and upload to gallery
//         [{
//             userId: { //uuid of user authorized to contribute and make changes to
//                 type: String,
//                 required: true,
//                 unique: true
//             },
//             isPermittedToMakeDeletions: { //if true, this user can delete any files from the gallery besides their own
//                 type: Boolean,
//                 required: true,
//                 default: false
//             }
//         }],
//         images: 
//         [{
//             fileId: {
//                 type: String,
//                 unique: true
//             },
//             name: String,
//             size: Number,
//             location: String, //a file path
//             date: { //date uploaded
//                 type: Date,
//                 default: Date.now
//             },
//             dateCreated: { //the file's internal date of creation
//                 type: Date
//             }
//         }]
//     }
// );

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
                        imgDate: {
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