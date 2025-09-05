const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    number: {
      type: String,
      required: function () {
        // Phone number required only if not using Google login or if Google user hasn't provided it yet
        return !this.google_id;
      },
      unique: true,
      sparse: true, // Allow multiple documents with null/undefined values
    },
    password_hash: {
      type: String,
      required: function () {
        // password required only if not using Google login
        return !this.google_id;
      },
    },
    google_id: {
      type: String,
      default: null, // will store Google user ID if login via Google
    },
    profile_pic_url: {
      type: String,
      default: "",
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    verification_token: {
      type: String,
      default: null,
    },
    verification_token_expires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
