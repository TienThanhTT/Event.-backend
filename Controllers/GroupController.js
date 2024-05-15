const Group = require("../Models/GroupModel");

module.exports.createGroup = async (req, res) => {
  try {
    const { name, leaderId } = req.body;

    if (!name || !leaderId) {
      return res
        .status(400)
        .json({ success: false, message: "Name and leaderId are required" });
    }

    const group = await Group.create({ name, leader: leaderId });
    res
      .status(201)
      .json({ success: true, message: "Tạo nhóm thành công!", group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports.addMember = async (req, res) => {
  try {
    const { groupId, name, phone, email } = req.body;

    if (!groupId || !name || !phone || !email) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    group.members.push({ name, phone, email });
    await group.save();

    res
      .status(200)
      .json({ success: true, message: "Member added successfully", group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports.searchGroupsByLeader = async (req, res) => {
  try {
    const { leaderId } = req.query;
    if (!leaderId) {
      return res
        .status(400)
        .json({ success: false, message: "Leader ID is required" });
    }

    const groups = await Group.find({ leader: leaderId });
    res
      .status(200)
      .json({ success: true, message: "Groups fetched successfully", groups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
