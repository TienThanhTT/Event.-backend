const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Name is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  banner: {
    type: String,
    default: null,
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
  startTime: {
    type: String,
    required: [true, "Start time is required"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Organizer is required"],
  },
  endTime: {
    type: Date,
    required: false,
  },

  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  ],

  soloParticipants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Event", eventSchema);
