import { model, Schema } from "mongoose";

//user model for database
const userSchema = new Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    mobile: { type: Number, required: [true, "Mobile number is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    username: {
      type: String,
      required: [true, "Password is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    userRole: {
      type: String,
      required: [true, "User Role is required"],
      enum: ["SADMIN", "ADMIN", "USER"],
      default: "USER",
    },
    isLoggedin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const user = model("user", userSchema);
export default user;
