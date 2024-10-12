import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    pass: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      required: false,
      default: "user",
    }
  },
  { timestamps: true }
);

// Clear and recompile model
mongoose.models = {};
const User = mongoose.model("User", userSchema);

export default User;