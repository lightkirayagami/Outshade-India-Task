const express = require("express");
const cors = require("cors");

require("./db/mongoose");

const UserRouter = require("./routers/user");
const MeetingRouter = require("./routers/meeting");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use(UserRouter);
app.use(MeetingRouter);

app.listen(port, function () {
  console.log("server is up");
});
