const {
  Create,

  GetEvent,
  GetEventDetail,
  UserJoinEvent,
  UploadImage,
} = require("../Controllers/EventController");
const upload = require("../Middlewares/multer");

const router = require("express").Router();

router.post("/create", Create);

router.post("/upload_image", upload.single("image"), UploadImage);
router.get("/get_event", GetEvent);
router.post("/get_detail", GetEventDetail);
router.post("/join_event", UserJoinEvent);

module.exports = router;
