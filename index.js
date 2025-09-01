//module initialization vv
const https = require('https');
const express = require("express");
const app = express();
const logger = require("morgan");
const path = require("path");
const methodOverride = require("method-override");
const fs = require("fs");

/* : : V : : THE GREAT FIREWALL : : V : : */

const BannedIP = require('./models/bannedIPModel');
const BannedPath = require('./models/bannedPathModel');
// vv moved to localBanStore.js in middlewares
// let localBannedIPs = new Set();
// let localBannedPaths = new Set();
const { localBannedIPs, localBannedPaths } = require('./middlewares/localBanStore');

// vv called at startup to populate local lists!
(async () => {
    const ipDocuments = await BannedIP.find({});
    ipDocuments.forEach(document => localBannedIPs.add(document.ip));

    const pathDocuments = await BannedPath.find({});
    pathDocuments.forEach(document => localBannedPaths.add(document.path));
})();

app.use(async (req, res, next) => {

    const ip = req.ip;
    const path = req.path;

    //vv tester logging vvv
    // console.log('path:',path,"ip:",ip);

    if (localBannedIPs.has(ip))
    {
        console.log('DEFLECTED',ip,':)');

        return res.status(403).send(":)"); //403 forbidden
    }
    
    if (localBannedPaths.has(path)) {

        console.log(`Auto-banning IP ${ip} for probing ${path}`);

        await BannedIP.create({ip: ip, reason: "Automated ban after attempting to access "+path});
        localBannedIPs.add(ip);
        
        return res.status(404).send("Not found");
    }

    next();
});

/* : ^ : ^ : THE GREAT FIREWALL : ^ : ^ : */

//allow vv api to be accessible from sites that don't share a domain/port
const cors = require("cors");
app.use(cors());

//LOGIN and SESSION Middleware including Session Storage on Mongo database
const session = require('express-session');
require('dotenv').config();

console.log("Deliver mail to: ",process.env.MAIL_DELIVERY_LOCATION);

//app middleware vv
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static('public'));

/* Session Store with MongoDB*/
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoSessionStore = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: 'media-sessions'
});
mongoSessionStore.on('error', function(error) {
    console.error("MongoDB Store error!",error);
});

/**LOGGING ~ ~ ~ */
// app.use(logger("dev")); // <-- Morgan default
const ipLogger = require("./middlewares/customLogger");
app.use(ipLogger);
/* END LOGGING */

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));

// LOGIN session Middleware
// (if using express-session....... O_O)
app.use(session(
    {
        name: "Session-ID",
        secret: process.env.SECRET_SESSION_KEY,
        resave: false,
        saveUninitialized: true,
        cookies: 
        {
            sameSite: true, // in theory, only accept the session cookie from my own site
            maxAge: 24*60*60*1000 // 24 hours before logged out automagically
        },
        store: mongoSessionStore
    }
));

/* ~ $ ~ $ ~ $ ~ R O U T E S ~ $ ~ $ ~ $ ~ */

const masterRouter = require("./routes/masterRouter");
app.use("/", masterRouter);

// ^ ^ ^ ^ ^ ^ ^ (routes) ^ ^ ^ ^ ^ ^ ^ ^ //
/* && _ && */

//mongodb connection
const connectToMongoDB = require('./db/mongodb');

const PORT = 8080; //TESTING PORT!
// const PORT = 6969;
// const PORT = 443;
// const httpPORT = 80;

/* ONLINE MODE WITH HTTPS! vv */
// const httpsOptions = {
//     cert: fs.readFileSync("ssl/fullchain.pem"),
//     key: fs.readFileSync("ssl/privkey.pem")
// }

// // http redirect vvv sends users to https site
// httpApp = express();
// const http = require('http');
// httpApp.get("*", function(req, res, next) { //single route to redirect
//     res.redirect("https://" + req.headers.host + req.path);
// });
// http.createServer(httpApp).listen(httpPORT, function() { //listens to redirect
//     console.log("Http redirect listening on port",httpPORT);
// });

// const server = https.createServer(httpsOptions, app);
// server.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);

//     connectToMongoDB();
// });
/* ONLINE MODE WITH HTTPS! ^^ */

// vv TESTING RUN
const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log('RUNNING IN TESTING MODE!');
    console.log('NOT ONLINE!');

    connectToMongoDB();
});

