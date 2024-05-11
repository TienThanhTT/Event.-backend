const Event = require("../Models/EventModel");
const multer = require("multer");

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

  const existEvent = Event.findOne({ soloParticipants: userId });

  if (!userId) {
    res.json({
      success: false,
      message: "Missing data",
    });
  } else {
    if (existEvent) {
      res.json({
        success: false,
        message: "Bạn đã đăng ký tham gia sự kiện này!",
      });
    } else {
      const event = await Event.updateOne(filter, userUpdate);
      res.json({
        success: true,
        message: "User join event successfully!",
        event,
      });
    }
  }
};

// module.exports.Upload = async (req, res) => {
//   if (!req.files) {
//     return res.json({
//       success: false,
//       message: "No files to upload",
//     });
//   }

//   let sampleFile = req.files.sampleFile;
//   let uploadPath = __dirname + "/uploads/" + sampleFile.name;

//   sampleFile.mv(uploadPath, (err) => {
//     if (err) {
//       res.json({
//         success: false,
//         message: "Upload fail",
//       });
//     }
//   });
// };

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Change 'uploads/' to your desired directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage });

module.exports.UploadImage = async (req, res) => {
  upload.single("image");
  console.log(req.body);
  const imageName = req.file.filename;
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
