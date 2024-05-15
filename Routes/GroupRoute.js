const {
  createGroup,
  searchGroupsByLeader,
  addMember,
} = require("../Controllers/GroupController");

const router = require("express").Router();

router.post("/create", createGroup);
router.post("/add_member", addMember);
router.post("/get_group", searchGroupsByLeader);

module.exports = router;
