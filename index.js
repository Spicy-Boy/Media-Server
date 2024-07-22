//module initialization vv
const https = require('https');
const express = require("express");
const app = express();
const logger = require("morgan");
const path = require("path");
const methodOverride = require("method-override");
const fs = require("fs");

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
// TODO: 
// Simplify to Route / IP / Time of day / User Session
// Make NOTE if file downloaded or uploaded

/* BEGIN LOGGING to console and file */

/*
let dateAtStartup = new Date;
let month = dateAtStartup.getMonth() + 1;
let day = dateAtStartup.getDate();
let year = dateAtStartup.getFullYear();

let logPath = `./logs/${year}-${month}-${day}`
fs.mkdir(logPath, {recursive: true}, (err) =>{
    if (err) {
        return console.error("Error creating the folder at "+logPath,err);
    }
    // console.log('New log folder created successfully @',logPath);
});
logPath = logPath + "/access.log"
fs.open(logPath, 'wx', (err, fd) => {
    if (err)
    {
        if (err.code === 'EEXIST')
        {
            console.log("Log file already exists @"+logPath+", not overwriting.");
        }
        else {
            console.error("Error creating the log file @ "+logPath,err);
        }
        return;
    }

    //if file didn't exist, continues to write it (empty string)
    fs.write(fd, '', (writeErr) => {
        if (writeErr) {
            console.error("Error writing to the log file @ "+logPath,writeErr);
        } else {
            console.log('File created successfully!');
        }

        fs.close(fd, (closeErr) => {
            if (closeErr) {
                console.error("Error writing to the log file at "+logPath,closeErr);
            }
        });
    });
});
*/
// app.use(logger("combined", {
//     stream: fs.createWriteStream(logPath, {flags: 'a'})
// }));
// morgan.token('ip', (req) => req.ip || req.connection.remoteAddress);
app.use(logger("dev"));


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

// AARON's custom user middleware!

// <%if (loginMessage) {%>
//     <h1><%=loginMessage%></h1>
// <%}%>

/* ~ R O U T E S ~ */
const viewRouter = require("./routes/viewRouter");
app.use("/", viewRouter);

//vv API for the BTW Speedrunning Competition donation portal
const donationRouter = require("./routes/donationRouter");
app.use("/api/donations", donationRouter);

const userRouter = require("./routes/userRouter");
app.use("/api/user", userRouter)

const fileRouter = require("./routes/fileRouter");
app.use("/api/file", fileRouter);

// const suicuneRouter = require("./routes/suicuneRouter");
// app.use("/api/suicune", suicuneRouter);

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

