const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  members: [
    {
      name: { type: String },
      phoneNumber: {
        type: String,
      },
      email: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Group", groupSchema);
