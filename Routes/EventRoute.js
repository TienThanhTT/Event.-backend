const {
  Create,

  GetEvent,
  GetEventDetail,
  UserJoinEvent,
  UploadImage,
  ShowEvent,
  GetUserOwnedEvents,
  deleteEvent,
  updateEvent,
  getRegisteredEvents,
  getRegisteredParticipants,
} = require("../Controllers/EventController");
const upload = require("../Middlewares/multer");

const router = require("express").Router();

router.get("/show_event", ShowEvent);
router.post("/registed_event", getRegisteredEvents);

router.post("/create", Create);
router.post("/upload_image", upload.single("image"), UploadImage);
router.post("/get_event", GetEvent);
router.post("/get_detail", GetEventDetail);
router.post("/join_event", UserJoinEvent);
router.post("/user_owned_event", GetUserOwnedEvents);
router.post("/delete_event", deleteEvent);
router.post("/update_event", updateEvent);
router.post("/get_participant", getRegisteredParticipants);

module.exports = router;
