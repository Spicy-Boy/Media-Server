//module initialization vv
const express = require("express");
const app = express();
const logger = require("morgan");
const path = require("path");
const methodOverride = require("method-override");

//app middleware vv
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static('public'));

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));

require('dotenv').config()

/* ~ R O U T E S ~ */
const viewRouter = require("./routes/viewRouter");
app.use("/", viewRouter);

// LOGIN session Middleware
// (if using express-session....... O_O)
const session = require('express-session');
app.use(session(
    {
        secret: process.env.SECRET_SESSION_KEY,
        resave: false,
        saveUninitialized: true,
        cookies: 
        {
            maxAge: 24*60*60*1000 // 24 hours before logged out automagically
        }
    }
));


//mongodb connection
const connectToMongoDB = require('./db/mongodb');

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);

    connectToMongoDB();
});

