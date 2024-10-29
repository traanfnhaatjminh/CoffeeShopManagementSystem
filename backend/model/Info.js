const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const infoSchema = new mongoose.Schema({
  name_shop: {
    type: String,
    required: [true, "Không được để trống tên cửa hàng"],
  },
  email_shop: {
    type: String,
    required: true,
  },
  phone_shop: {
    type: String,
    required: true,
  },
  address_shop: {
    type: String,
    required: true,
  },
  created_time: {
    type: Date,
    default: Date.now,
  },
  logo_shop: {
    type: String,
    required: true,
  },
  operating_info: {
    time_open: {
      type: String,
      required: true,
    },
    time_close: {
      type: String,
      required: true,
    },
    is_open_today: {
      type: Boolean,
      default: true,
    },
    special_notes: {
      type: String,
    },
  },
  // Link to User schema for the owner
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
const Info = mongoose.model("Info", infoSchema);
module.exports = Info;