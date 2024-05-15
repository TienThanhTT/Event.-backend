const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  members: [
    {
      name: { type: String },
      phone: {
        type: String,
      },
      email: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("Group", groupSchema);
