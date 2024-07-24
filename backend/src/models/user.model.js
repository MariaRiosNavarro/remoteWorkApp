import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    salt: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    // Wir machen hier keine Registrierung, da die Users schon existieren, dh lassen erstmal das default TRUE
    isEmailVerified: { type: Boolean, default: true },
  },
  { collection: "auth", timestamps: true }
);

export const UserModel = mongoose.model("user", userSchema);
