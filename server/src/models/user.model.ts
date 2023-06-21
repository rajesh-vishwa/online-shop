import mongoose, { Document, Schema } from "mongoose";
import { randomInt } from "crypto";
import Joi from "joi";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "../dtos/create-user.dto";

interface IUserDocument extends Document {
  name: string;
  email: string;
  hashed_password: string;
  salt?: string;
  updated?: Date;
  created?: Date;
  isSeller?: boolean;
  generateSalt: () => number;
  hashPlainPassword: (plainPassword: string) => Promise<string>;
  authenticate: (plainPassword: string) => Promise<boolean>;
}

const userSchema: Schema<IUserDocument> = new mongoose.Schema<IUserDocument>({
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
  generateSalt: function (): number {
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

const User = mongoose.model<IUserDocument>("User", userSchema);

export default User;

export function validateUser(user: CreateUserDto) {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(255),
    email: Joi.string().required().min(3).max(255).email(),
    password: Joi.string().required().min(3).max(255),
  });

  return schema.validate(user);
}
