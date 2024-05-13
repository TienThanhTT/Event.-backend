const Event = require("../Models/EventModel");
const cloudinary = require("../util/Cloudinary");
const upload = require("../Middlewares/multer");
const { default: mongoose } = require("mongoose");

module.exports.Create = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      date,
      banner,
      location,
      startTime,
      endTime,
      owner,
      groups,
      soloParticipants,
      createdAt,
    } = req.body;

    if (!title || !description || !startTime) {
      res.json({ success: false, message: "Not enough information" });
    }

    const event = await Event.create({
      title,
      description,
      category,
      date,
      banner,
      location,
      startTime,
      endTime,
      owner,
      groups,
      soloParticipants,
      createdAt,
    });

    res.status(201).json({
      success: true,
      message: "Create event successfully!",
      event,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.UserJoinEvent = async (req, res) => {
  const { eventId, userId } = req.body;
  const filter = { _id: eventId };

  const userUpdate = { $push: { soloParticipants: userId } };
  // const groupUdate = { $push: { groups: groupId } };

  if (!userId) {
    res.json({
      success: false,
      message: "Missing data",
    });
  } else {
    const existEvent = Event.findOne({
      _id: eventId,
    });
    if (existEvent) {
      res.json({
        success: false,
        message: "Bạn đã đăng ký tham gia sự kiện này!",
        existEvent,
      });
    } else {
      const event = await Event.updateOne(filter, userUpdate);
      res.json({
        success: true,
        message: "Đăng ký tham gia thành công!",
        event,
      });
    }
  }
};

module.exports.UploadImage = async (req, res) => {
  cloudinary.uploader.upload(req.file.path, function (err, result) {
    if (err) {
      console.log(err);
      res.json({
        success: false,
        message: "Upload image fail",
      });
    }
    res.json({
      success: true,
      message: "Uploaded",
      data: result.url,
    });
  });
};

module.exports.GetEvent = async (req, res) => {
  try {
    const events = await Event.find({ category: "MUSIC" });

    res.json({
      success: true,
      message: "Get event successfully!",
      events,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.GetEventDetail = async (req, res, next) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      res.json({
        success: false,
        message: "Missing data",
      });
    } else {
      const event = await Event.findById(eventId).populate("owner").exec();
      const ownerInf = event.owner;
      res.json({
        success: true,
        message: "Find event successfully",
        event,
        ownerInf,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
