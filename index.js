//module initialization vv
const express = require("express");
const app = express();
const logger = require("morgan");
const path = require("path");
const methodOverride = require("method-override");
const fs = require("fs");

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
    collection: 'forum-sessions'
});
mongoSessionStore.on('error', function(error) {
    console.error("MongoDB Store error!",error);
});

/* LOGGING to console and file */
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

app.use(logger("combined", {
    stream: fs.createWriteStream(logPath, {flags: 'a'})
}));
// morgan.token('ip', (req) => req.ip || req.connection.remoteAddress);
app.use(logger("dev"));

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

const userRouter = require("./routes/userRouter");
app.use("/api/user", userRouter)

const suicuneRouter = require("./routes/suicuneRouter");
app.use("/api/suicune", suicuneRouter);

/* && _ && */

//mongodb connection
const connectToMongoDB = require('./db/mongodb');

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);

    connectToMongoDB();
});

