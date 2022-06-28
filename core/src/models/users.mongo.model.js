const mongoose = require("mongoose");
const { BADGES } = require("../constants");

const userSchema = mongoose.Schema(
  {
    name: { type: "String", unique: true, required: true },
    email: { type: "String", unique: true, required: true },
    pic: {
      type: "String",
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    badges: {
      type: Map,
      of: {
        badgeType: {
          type: "String",
          default: BADGES.BRONZE
        },
        count: {
          type: Number,
          default: 0
        }
      }
    }
  },
  { timestaps: true }
);

const MongoUser = mongoose.model("User", userSchema);

module.exports = MongoUser;
