const { model } = require("mongoose");
const User = require("../Models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.json({ status: false, message: "Missing token!" });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false, message: "Cookie verify fail!" });
    } else {
      const user = await User.findById(data.id);
      if (user) {
        return res.json({ status: true, user });
      } else {
        return res.json({ status: false, message: "No user!" });
      }
    }
  });
};

module.exports.adminAuth = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.json({ status: false });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const user = await User.findById(data.id);
      if (!user) {
        res.json({ status: false, message: "Something went wrong" });
      } else {
        if (user.role !== "admin") {
          res.json({ status: false, message: "Not authorized" });
        } else {
          next();
        }
      }
    }
  });
};

module.exports.userAuth = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    res.json({ status: false });
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      res.json({ status: false });
    } else {
      const user = await User.findById(data.id);
      if (!user) {
        json({ status: false, message: "Something went wrong!" });
      }
      if (user.role !== "user") {
        res.json({ status: false, message: "Not authorized" });
      } else {
        next();
      }
    }
  });
};
