const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const donationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: "Anonymous",
        },
        amount: {
            type: Number,
            required: true
        }, 
        message: {
            type: String,
            required: true
        },
        img: { //the filename
            type: String
        },
        imgWidth: {
            type: Number,
        },
        imgHeight: {
            type: Number,
        },
        created: { 
            type: Date,
            default: Date.now
        }
    }
)

const Donation = mongoose.model('Donation', donationSchema)

module.exports = Donation;