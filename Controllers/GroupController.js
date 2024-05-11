const Group = require("../Models/GroupModel");

module.exports.Create = async (req, res) => {
  try {
    const { name, description, leader, members } = req.body;
    if (!name || !leader) {
      res.json({ success: false, message: "Mising data" });
    }

    const group = await Group.create({ name, description, leader, members });

    res
      .status(201)
      .json({ sucess: true, message: "Tạo nhóm thành công!", group });
  } catch (error) {
    console.log(error);
  }
};

module.exports.GetGroup = async (req, res) => {
  try {
    const userId = req.body;
    if (!userId) {
      res.json({
        success: false,
        message: "Missing data",
      });
    } else {
      const groups = Group.find({ leader: userId });
      res.json({
        success: true,
        message: "Found groups",
        groups,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
