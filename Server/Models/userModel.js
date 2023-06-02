import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide you name"],
  },
  employeeId: {
    type: Number,
    unique: true,
    required: [true, "Please provide your employee ID"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  updatedPassword: {
    type: Number,
    default: 0,
  },
  theme: {
    type: String,
    default: "none",
  },
  fontSize: {
    type: Number,
    default: 0,
  },
  images: [String],
  predictions: [{ predictions: [String, String] }],
});

const User = mongoose.model("User", userSchema);

export { User };
