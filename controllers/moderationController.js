const BannedIP = require('../models/bannedIPModel');
const BannedPath = require('../models/bannedPathModel');

const { localBannedIPs, localBannedPaths } = require('../middlewares/localBanStore');

//vv adds an IP to banlist on db
async function addIP(req, res)
{
    const ipToBan = req.body.ip;
    const reasonForBan = req.body.reason;
    try
    {
        await BannedIP.create({ip: ipToBan, reason: reasonForBan});

        if (localBannedIPs)
        {
            localBannedIPs.add(pathToBan);
        }

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

        if (localBannedPaths)
        {
            localBannedPaths.add(pathToBan);
        }

        // return res.status(200).send("Successful Path ban!");
        console.log('Banned path:',pathToBan);
        return res.status(200).redirect(process.env.USER_MANAGEMENT_PATH);
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