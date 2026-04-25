import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  bookId: {
    type: String,
    required: true,
  },

  currentPage: {
    type: Number,
    default: 1,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// one progress per user per book
progressSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export default mongoose.model("Progress", progressSchema);