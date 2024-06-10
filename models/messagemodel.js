const mongoose = require("mongoose");

const Schema = new mongoose.Schema();

const MessageSchema = new Schema({
  text: { type: String },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("MessageModel", MessageSchema);
