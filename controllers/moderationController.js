const BannedIP = require('../models/bannedIPModel');
const BannedPath = require('../models/bannedPathModel');

//vv adds an IP to banlist on db
async function addIP(req, res)
{
    const ipToBan = req.body.ip;
    const reasonForBan = req.body.reason;
    try
    {
        await BannedIP.create({ip: ipToBan, reason: reasonForBan});

        return res.status(200).send("Successful IP ban!");
    }
    catch (error)
    {
        console.log('Error occured attempting to add ip to database banlist!',error);
        return res.status(500);
    }
}

// vv adds a path to banlist on db
async function addPath(req, res)
{
    const pathToBan = req.body.path;
    const reasonForBan = req.body.reason;
    try
    {
        await BannedPath.create({path: pathToBan, reason: reasonForBan});

        return res.status(200).send("Successful Path ban!");
    }
    catch (error)
    {
        console.log('Error occured attempting to add path to database banlist!',error);
        return res.status(500);
    }
}

module.exports = {
    addIP,
    addPath
};