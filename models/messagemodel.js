const mongoose = require("mongoose");

const Schema = new mongoose.Schema();

const MessageSchema = new Schema({
  title: {type: String, required: true},
  text: { type: String, required: true },
  date: {type: Date},
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("MessageModel", MessageSchema);
