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
router.post("/deleteUser", adminAuth, deleteUser);
router.post("/updateUser", adminAuth, updateUser);
router.get("/getUser", getUser);  

module.exports = router;
