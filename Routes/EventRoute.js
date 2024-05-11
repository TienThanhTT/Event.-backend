const {
  Create,

  GetEvent,
  GetEventDetail,
  UserJoinEvent,
  UploadImage,
} = require("../Controllers/EventController");
const multer = require("multi");
const upload = multer({ dest: "uploads/" });

const router = require("express").Router();

router.post("/create", Create);

router.post("/upload_image", UploadImage);
router.post("/get_event", GetEvent);
router.post("/get_detail", GetEventDetail);
router.post("/join_event", UserJoinEvent);

module.exports = router;
