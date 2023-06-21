import mongoose from "mongoose";
import { randomInt } from "crypto";
import Joi from "joi";
import * as bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true, min: 3, max: 255 },
  email: {
    type: String,
    trim: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
    required: true,
    min: 3,
    max: 255,
  },
  hashed_password: {
    type: String,
    required: true,
  },
  salt: String,
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
  isSeller: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods = {
  generateSalt: function () {
    return randomInt(8, 12);
  },
  hashPlainPassword: async function (plainPassword: string) {
    if (!plainPassword) return "";
    try {
      const salt = this.generateSalt();
      const hashedPassword = await bcrypt.hash(plainPassword, salt);

      return hashedPassword;
    } catch (err) {
      return "";
    }
  },
  authenticate: async function (plainPassword: string) {
    //return this.hashPlainPassword(plainPassword) === this.hashed_password
    const isMatched = await bcrypt.compare(plainPassword, this.hashed_password);
    return isMatched;
  },
};

const User = mongoose.model("User", userSchema);

export default User;

export function validateUser(user: any) {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(255),
    email: Joi.string().required().min(3).max(255).email(),
    password: Joi.string().required().min(3).max(255),
  });

  return schema.validate(user);
}
