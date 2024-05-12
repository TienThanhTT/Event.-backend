const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, name, phone, address, role, event, createdAt } =
      req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Chưa đủ thông tin!",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already existed",
      });
    }

    const user = await User.create({
      email,
      password,
      name,
      phone,
      address,
      event,
      role,
      createdAt,
    });
    const token = createSecretToken(user._id);
    res.cookie("access_token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "All field are required", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const token = createSecretToken(user._id);
    res.cookie("access_token", token, {
      withCredentials: true,
      httpOnly: false,
      sameSite: "none",
      secure: true,
    });
    res
      .status(201)
      .json({ message: "User login successfully", success: true, user });
  } catch (error) {
    console.log(error);
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.body;
    const user = await User.findById(id);
    if (!user) {
      res.json({ message: "There are something wrong", success: false });
    }
    const deleteUser = await User.deleteOne();
    if (deleteUser) {
      res.json({ message: "Deleted user", success: true });
    } else {
      res.json({ message: "There are something wrong", success: false });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { id, newEmail, newUsername } = req.body;

    const user = User.findById(id);
    if (!user) {
      res.json({ success: false, message: "Update fail, Can't find user" });
    }

    const filter = {
      _id: id,
    };
    const updateQuery = {
      email: newEmail,
      username: newUsername,
    };

    const updateUser = await user.findOneAndUpdate(filter, updateQuery, {
      new: true,
    });
    if (updateUser) {
      res.json({ success: true, message: "Update successfully" });
    } else {
      res.json({ success: false, message: "Update fail" });
    }

    res.json({ success: true, message: "Update successfully" });
  } catch (error) {
    console.log(error);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    await User.find({}).then((users) => {
      const listUser = users.map((user) => {
        const container = {};
        container._id = user._id;
        container.username = user.username;
        container.email = user.email;
        container.role = user.role;
        return container;
      });
      res.json({
        success: true,
        users: listUser,
      });
    });
  } catch (error) {
    console.log(error);
  }
};
