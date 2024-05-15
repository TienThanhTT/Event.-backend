const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: [true, "Your email address is required"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Your name is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  avatar: {
    type: String,
    required: false,
    default: null,
  },
  phone: {
    type: String,
    required: false,
    default: null,
  },
  address: {
    type: String,
    required: false,
    default: null,
  },

  role: {
    type: String,
    required: [true],
    default: "user",
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("User", userSchema);
