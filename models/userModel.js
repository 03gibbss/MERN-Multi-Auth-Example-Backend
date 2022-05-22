const mongoose = require("mongoose");

const passportLocalMongoose = require("passport-local-mongoose");

const Session = new mongoose.Schema({
  refreshToken: {
    type: String,
    default: "",
  },
});

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: [Session],
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    delete ret.refreshToken;
    return ret;
  },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = User = mongoose.model("User", UserSchema);
