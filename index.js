//module initialization vv
const express = require("express");
const app = express();
const logger = require("morgan");
const path = require("path");
const methodOverride = require("method-override");

require('dotenv').config();

console.log(process.env.MAIL_DELIVERY_LOCATION);

//app middleware vv
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static('public'));

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));

// LOGIN session Middleware
// (if using express-session....... O_O)
const session = require('express-session');
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
        }
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

