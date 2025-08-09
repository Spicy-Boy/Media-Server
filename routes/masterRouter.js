const router = require("express").Router();
const path = require("path");

//based on user's permissions, direct where they can go after logging in
router.use("/redirectLogin", async () =>{

    let redirectTo = "/login"; // just in case

    if (!req.session.userId)
    {
        req.session.returnTo = req.originalUrl;
        res.status(403).redirect("/login");
    }
    else if (req.session.userId  && req.session.returnTo)
    {
        const redirectTo = req.session.returnTo;
        req.session.returnTo = null;
        res.redirect(redirectTo);
    }
    
    //ADVANCED PERMISSIONS ROUTING FOR HOMEPAGE GOES HERE vvv!!

    res.send("you found /redirectLogin !!!");
});

const viewRouter = require("./viewRouter");
router.use("/", viewRouter);

const apiRouter = require("./apiRouter");
router.use("/api", apiRouter);

module.exports = router;