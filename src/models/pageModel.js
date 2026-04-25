import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true,
  },

  page: {
    type: Number,
    required: true,
  },

  promptVersion: {
    type: String,
    default: "v1",
  },

  finalText: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// index for fast lookup, still dont know how it works clearly
pageSchema.index({ bookId: 1, page: 1, promptVersion: 1 }, { unique: true });

export default mongoose.model("Page", pageSchema);