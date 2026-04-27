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

  model: {
    type: String,
    required: true,
    default: "gemini",
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

//  unique per model + prompt
pageSchema.index(
  { bookId: 1, page: 1, model: 1, promptVersion: 1 },
  { unique: true }
);

export default mongoose.model("Page", pageSchema);