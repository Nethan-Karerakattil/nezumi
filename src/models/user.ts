import { Schema, model } from "mongoose";

export const userSchema = new Schema({
    uid: { type: String, required: [true, "uid was not specified"] },
    warns: { type: Array }
});

export const User = model("user", userSchema);