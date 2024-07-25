import mongoose from "mongoose";

const timeSchema = new mongoose.Schema(
  {
    userIdRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    startTime: {
      type: Date,
      default: Date.now,
      required: true,
    },
    endTime: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["open", "close"],
      default: "open",
    },
    durationTime: {
      type: String,
      default: null,
    },
  },
  {
    collection: "time",
    timestamps: true,
  }
);

export const TimeModel = mongoose.model("time", timeSchema);
