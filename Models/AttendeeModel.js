const mongoose = require("mongoose");

const attendeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  name: {
    type: String,
    required: [true, "Attendee name is required"],
  },
  phone: {
    type: String,
    required: [true, "Your phone is required"],
  },
  checked: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Attendee", attendeeSchema);
