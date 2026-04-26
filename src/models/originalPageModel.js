import mongoose from "mongoose";

const originalPageSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true,
  },

  page: {
    type: Number,
    required: true,
  },

  text: {
    type: String,
    required: true,
  },
});

// fast lookup
originalPageSchema.index({ bookId: 1, page: 1 }, { unique: true });

export default mongoose.model("OriginalPage", originalPageSchema);