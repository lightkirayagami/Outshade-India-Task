const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const userschema = new mongoose.Schema(
  {
    username: {
      unique: true,
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 7,
    },

    canChangePassword: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      unique: true,
      required: true,

      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// vendorschema.virtual("Products", {
//   //anyname
//   ref: "Product",
//   localField: "_id",
//   foreignField: "vendor",
// });

userschema.methods.generatetoken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.id.toString() }, "outshadeindia");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
userschema.statics.findbycredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }
  const ismatch = await bcrypt.compare(password, user.password);
  if (!ismatch) {
    throw new Error("wrong password");
  }
  return user;
};
userschema.statics.findbyemail = async function (email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }

  return user;
};

userschema.pre("save", async function (next) {
  //hasing before saving//we also made chages in default code
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userschema);
module.exports = User;
