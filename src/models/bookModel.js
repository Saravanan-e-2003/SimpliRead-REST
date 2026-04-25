import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true,
    unique: true,
  },

  userId: {
    type: String,
    required: true,
  },

  title: {
    type: String,
  },

  fileUrl: {
    type: String,
    required: true,
  },

  totalPages: {
    type: Number,
    default: 0,
  },

  startPage: {
    type: Number,
    default: 1,
  },

  category: {
    type: String,
    default: "general",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Book", bookSchema);