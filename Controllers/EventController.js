const Event = require("../Models/EventModel");
const cloudinary = require("../util/Cloudinary");
const User = require("../Models/UserModel");

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

module.exports.updateEvent = async (req, res, next) => {
  try {
    const {
      eventId,
      newTitle,
      newDescription,
      newDate,
      newLocation,
      newBanner,
    } = req.body;

    // Check if the required fields are present
    if (!eventId) {
      return res
        .status(400)
        .json({ success: false, message: "Event ID is required" });
    }

    // Check if user exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // Prepare update object
    const updateQuery = {};
    if (newTitle) updateQuery.title = newTitle;
    if (newDescription) updateQuery.description = newDescription;
    if (newDate) updateQuery.date = newDate;
    if (newLocation) updateQuery.location = newLocation;
    if (newBanner) updateQuery.banner = newBanner;

    // Check if there are fields to update
    if (Object.keys(updateQuery).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No data provided to update" });
    }

    // Update user
    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateQuery, {
      new: true,
    });

    if (updatedEvent) {
      return res.status(200).json({
        success: true,
        message: "Cập nhật thông tin thành công!",
        user: updatedEvent,
      });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Cập nhật thông tin thất bại!" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Lỗi sever" });
  }
};

module.exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res
        .status(400)
        .json({ success: false, message: "Group ID is required" });
    }

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sự kiện!" });
    }

    res.status(200).json({
      success: true,
      message: "Đã xóa thành công!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports.ShowEvent = async (req, res) => {
  try {
    const events = await Event.find({}, null, { limit: 3 }).sort({ _id: -1 });
    if (!events) {
      res.json({
        success: false,
        message: "Get fail!",
      });
    }
    res.json({
      success: true,
      message: "Get event successfully!!",
      events,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.UserJoinEvent = async (req, res) => {
  try {
    const eventId = req.body[0];
    const userId = req.body[1];
    const user = await User.findById(userId);
    const filter = { _id: eventId };
    const userUpdate = {
      $push: { soloParticipants: user._id },
    };
    // const groupUdate = { $push: { groups: groupId } };
    const existEvent = await Event.find(
      {
        _id: eventId,
        soloParticipants: userId,
      },
      {}
    );

    if (existEvent.length !== 0) {
      res.json({
        success: false,
        message: "Lỗi! Bạn đã đăng ký tham gia sự kiện này!",
      });
    } else {
      const event = await Event.updateOne(filter, userUpdate);
      if (!event) {
        res.json({
          success: false,
          message: "Fail!",
        });
      }
      res.json({
        success: true,
        message: "Đăng ký tham gia thành công!",
      });
    }
  } catch (error) {
    console.log(error);
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

module.exports.GetUserOwnedEvents = async (req, res) => {
  try {
    const { userId } = req.body;

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find events where the user is the owner
    const events = await Event.find({ owner: userId });

    // Check if events are found
    if (events.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sự kiện nào",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Events fetched successfully",
        events,
      });
    }

    // Return the events
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports.getRegisteredEvents = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const events = await Event.find({ soloParticipants: userId })
      .populate("owner", "name email")
      .exec();

    if (!events.length) {
      return res.status(404).json({
        success: false,
        message: "Bạn chưa đăng ký tham gia sự kiện nào cả",
      });
    }

    res.status(200).json({
      success: true,
      message: "Registered events retrieved successfully",
      events,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports.GetEvent = async (req, res) => {
  try {
    const { categoryId } = req.body;
    if (!categoryId) {
      res.json({
        success: false,
        message: "Missing data",
      });
    }
    const events = await Event.find({ category: categoryId });

    if (events) {
      res.json({
        success: true,
        message: "Get event successfully!",
        events,
      });
    } else {
      res.json({
        success: false,
        message: "Get event fail",
      });
    }
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

module.exports.getRegisteredParticipants = async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res
        .status(400)
        .json({ success: false, message: "Event ID is required" });
    }

    const event = await Event.findById(eventId)
      .populate("soloParticipants", "name email")
      .populate({
        path: "groups",
        populate: {
          path: "members",
          model: "Member",
        },
      })
      .exec();

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    const registeredUsers = event.soloParticipants.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    }));

    const registeredGroups = event.groups.map((group) => ({
      id: group._id,
      name: group.name,
      members: group.members.map((member) => ({
        id: member._id,
        name: member.name,
        email: member.email,
      })),
    }));

    res.status(200).json({
      success: true,
      message: "Registered participants retrieved successfully",
      registeredUsers,
      registeredGroups,
      event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
