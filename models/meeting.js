const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const meetingschema = new mongoose.Schema({
  meetingname: {
    type: String,
    required: true,
  },
  inviting: [
    {
      type: String,
      required: true,
    },
  ],
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "User",
  },
  creatorname: {
    type: String,

    ref: "User",
  },
});
const Meeting = mongoose.model("Meeting", meetingschema);
module.exports = Meeting;
