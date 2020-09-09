const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  bio: { type: String, default: "" },
  isTeacher: {type: Boolean, default: false },
  notifications: [
    {
      body: String,
      username: String,
      createdAt: String
    }
  ],
});

module.exports = model("User", userSchema);
