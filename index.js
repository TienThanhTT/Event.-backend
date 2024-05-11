const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const authRoute = require("./Routes/AuthRoute");
const eventRoute = require("./Routes/EventRoute");
const groupRoute = require("./Routes/GroupRoute");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const { MONGODB_URL, PORT } = process.env;

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
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(cookieParser());
app.use(express.json());

// route
app.use("/", authRoute);
app.use("/event", eventRoute);
app.use("/group", groupRoute);
