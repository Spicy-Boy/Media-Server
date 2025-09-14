const router = require("express").Router();
const path = require("path");

//based on user's permissions, direct where they can go after logging in
router.get("/redirectLogin", async (req, res, next) =>{

    if (!req.session.userId)
    {
        return res.status(403).redirect("/login");
    }
    
    if (req.session.activeUser.isFrozen)
    {
        return res.status(403).send("<center>🥶</center>")
    }
    
    if (req.session.activeUser.isCurator)
    {
        return res.redirect(process.env.REDIRECT_AFTER_LOGIN_CURATOR);
    }

    if (req.session.activeUser.isUploader)
    {
        return res.redirect(process.env.REDIRECT_AFTER_LOGIN_UPLOADER);
    }

    if (req.session.activeUser)
    {
        return  res.sendFile(path.join(__dirname, "../public/html/holding.html"));
    }

    return res.send("WOW HOLY COW! If you see this message, contact admin ASAP!!!");
});

const apiRouter = require("./apiRouter");
router.use("/api", apiRouter);

const viewRouter = require("./viewRouter");
router.use("/", viewRouter);

module.exports = router;