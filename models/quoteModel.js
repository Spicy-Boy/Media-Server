// this model creates database entries for quotes to be displayed on a page... or whatever you like!
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quoteSchema = new mongoose.Schema(
    {
        quote: {
            type: String,
            required: true
        },
        attribution: { //the person that supposedly said the quote
            type: String, 
            default: ""
        },
        context: { //basically, an extra note that may or may not be displayed
            type: String,
            default: ""
        },
        day: {
            type: number,
            default: 0
        },
        month: {
            type: number,
            default: 0
        },
        createdAt: { //keeps track of when the database entry is made
            type: Date,
            default: Date.now
        }
    }
)

const Quote = mongoose.model('Quote', quoteSchema)