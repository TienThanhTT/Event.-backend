const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const authRoute = require("./Routes/AuthRoute");
const eventRoute = require("./Routes/EventRoute");
const groupRoute = require("./Routes/GroupRoute");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const { MONGODB_URL, PORT } = process.env || 4000;

// connect database
mongoose
  .connect(MONGODB_URL)
  .then(() => console.log("Connected to database"))
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(
  cors({
    // origin: "https://eventdot.netlify.app",

    origin: "http://localhost:3000/",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use((req, res, next) => {
  // res.setHeader("Access-Control-Allow-Origin", "https://eventdot.netlify.app");
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000/");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});
app.use(cookieParser());
app.use(express.json());

// route
app.get("/", (req, res) => {
  res.send("hello from server");
});
app.use("/", authRoute);
app.use("/event", eventRoute);
app.use("/group", groupRoute);
