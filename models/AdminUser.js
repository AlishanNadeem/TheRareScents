const mongoose = require("mongoose");

const { Schema } = mongoose;

const adminUserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    // Never store plaintext passwords — only the bcrypt hash. See
    // scripts/create-admin.js for how this gets set.
    password_hash: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports =
  mongoose.models.AdminUser || mongoose.model("AdminUser", adminUserSchema);
