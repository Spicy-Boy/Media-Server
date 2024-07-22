const Donation = require("../models/donationModel");
const sharp = require('sharp'); //used to gather image file metadata like width and height

async function createNewDonation(req, res)
{
    try {
        let newDonation = {
            name: req.body.name,
            amount: req.body.amount,
            message: req.body.message
        }

        if (req.file)
        {
            const imgMetadata = await sharp(req.file.path).metadata();
            newDonation.imgWidth = imgMetadata.width;
            newDonation.imgHeight = imgMetadata.height;
            newDonation.img = req.file.filename;
        }

        await Donation.create(newDonation);
        res.send("<h1>Donation created!</h1>");
    }
    catch (error) {
        console.error("ERROR CREATING DONATION!",error);
        res.send("Something went wrong Aaron ;p");
    }
}

async function getDonations(req, res)
{
    try {
        //gets all threads and send it as a JSON
        let results = await Donation.find({});
        
        res.status(200).json({
            message: "FETCHED DONATIONS!!",
            payload: results
        });
    }
    catch (error) {
        console.error("ERROR FETCHING DONATIONS!",error);
        res.status(500).send("Failed to fetch donations!");
    }
}

module.exports = {
    createNewDonation,
    getDonations
};