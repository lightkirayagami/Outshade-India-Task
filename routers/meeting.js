const express = require("express");
const router = new express.Router();
const Meeting = require("../models/meeting");
const auth = require("../middleware/auth");
const User = require("../models/user");
var async = require("async");

router.post("/create_meeting", auth, async (req, res) => {
  //to create a new meeting
  const meeting = new Meeting({
    ...req.body,
    creatorId: req.user.id,
    creatorname: req.user.username,
  });

  try {
    await meeting.save();
    console.log("successfully created");
    res.send(meeting);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/check_created_meetings", auth, async (req, res) => {
  //get all meetings created by a user
  try {
    let { page, size, sort } = req.query;

    if (!page) {
      page = 1;
    }

    if (!size) {
      size = 10;
    }
    const limit = parseInt(size);
    const meetings = await Meeting.find({ creatorname: req.user.username })
      .sort({ _id: -1 }) //descending order
      .limit(limit);
    res.send({
      page,
      size,
      Info: meetings,
    });
  } catch (e) {
    res.send(e);
  }
});

router.get("/check_invited_meetings", auth, async (req, res) => {
  //get list of meetings he is invited
  try {
    let { page, size, sort } = req.query;

    if (!page) {
      page = 1;
    }

    if (!size) {
      size = 10;
    }

    const limit = parseInt(size);

    const allMeeting = await Meeting.find({}).sort({ _id: 1 }).limit(limit); //ascending order
    const username = req.user.username;

    const allmeeting = [];
    const allInvitedMeetings = allMeeting.filter((element) =>
      element.inviting.forEach((element1) => {
        if (element1 === username) {
          allmeeting.push(element);
        }
      })
    );
    if (allmeeting.length == 0) {
      res.send("you are not invited to any meeting");
    }
    res.send({
      page,
      size,
      Info: allmeeting,
    });
  } catch (e) {
    res.send(e.message);
  }
});

router.get("/meetind_details/:id", async (req, res) => {
  //get paticular meeting details
  try {
    const _id = req.params.id;
    const meeting = await Meeting.findById(_id);
    if (!meeting) {
      res.send("no such meeitng exsist");
    }
    res.send(meeting);
  } catch (e) {
    res.send(e.message);
  }
});

router.patch("/update_meeting/:id", auth, async (req, res) => {
  //update a meeting
  const _id = req.params.id;
  const meeting = await Meeting.findById(_id);
  const updates = Object.keys(req.body); //array of strings
  const allowedupdates = ["inviting", "meetingname"];
  const isvalid = updates.every((update) => {
    return allowedupdates.includes(update);
  });
  if (!isvalid) {
    res.send("not allowed property");
  }
  try {
    updates.forEach((update) => {
      meeting[update] = req.body[update];
    });
    await meeting.save();
    res.send(meeting);
  } catch (e) {
    res.send(e);
  }
});
module.exports = router;
