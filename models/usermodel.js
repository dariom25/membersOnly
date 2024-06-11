const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  admin: { type: Boolean },
  email: { type: String, required: true },
  password: { type: String }
});

module.exports = mongoose.model("UserModel", UserSchema);
