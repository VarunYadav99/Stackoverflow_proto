const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/message.controller");
const { auth, checkOwnership } = require('../middleware');

const router = express.Router();

router.route("/:chatId").get(auth, allMessages);
router.route("/").post(auth, sendMessage);

module.exports = router;
