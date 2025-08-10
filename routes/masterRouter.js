const router = require("express").Router();
const path = require("path");

//based on user's permissions, direct where they can go after logging in
router.get("/redirectLogin", async (req, res, next) =>{

    let redirectTo = "/login"; // just in case

    if (!req.session.userId)
    {
        return res.status(403).redirect("/login");
    }
    
    //ADVANCED PERMISSIONS ROUTING FOR HOMEPAGE GOES HERE vvv!!

    res.send("you found /redirectLogin !!!");
});

const apiRouter = require("./apiRouter");
router.use("/api", apiRouter);

const viewRouter = require("./viewRouter");
router.use("/", viewRouter);

module.exports = router;