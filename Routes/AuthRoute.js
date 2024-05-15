const {
  Signup,
  Login,
  getUser,
  deleteUser,
  updateUser,
} = require("../Controllers/AuthController");
const {
  userVerification,
  adminAuth,
} = require("../Middlewares/AuthMiddleware");
const router = require("express").Router();

router.post("/", userVerification);
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/delete_user", adminAuth, deleteUser);
router.post("/update_user", updateUser);
router.get("/getUser", getUser);

module.exports = router;
