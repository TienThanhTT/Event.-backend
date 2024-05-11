const { Create, GetGroup } = require("../Controllers/GroupController");

const router = require("express").Router();

router.post("/create", Create);
router.post("/get_group", GetGroup);

module.exports = router;
