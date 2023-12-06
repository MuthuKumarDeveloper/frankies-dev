const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: { type: Number, required: true },
  status: { type: String },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Password must be at least 6 characters long
        return value && value.length >= 6;
      },
      message: "Password must be at least 6 characters long",
    },
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
