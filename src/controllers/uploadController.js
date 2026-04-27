import { uploadToBlob } from "../services/blobService.js";
import { deleteFile } from "../utils/cleanup.js";
import { generateHash } from "../utils/bookHash.js";
import Book from "../models/bookModel.js";

export async function handleUpload(req, res) {
  try {
    const file = req.file;
    const userId = req.headers.userid || "user_1";

    if (!file || file.mimetype !== "application/pdf") {
      return res.status(400).send("Only PDF allowed");
    }

    //  hash first
    const bookId = await generateHash(file.path);

    // check existing
    let existingBook = await Book.findOne({ bookId });

    if (existingBook) {
      deleteFile(file.path);

      return res.json({
        message: "Book already exists",
        book: existingBook,
      });
    }

    // upload + SAS
    const { url, blobName } = await uploadToBlob(
      file.path,
      file.originalname,
      bookId
    );

    //  store in DB
    const newBook = await Book.create({
      bookId,
      userId,
      fileUrl: url,      //  store SAS URL
      blobName,          //  important for future SAS regen
      title: file.originalname,
    });

    deleteFile(file.path);

    res.json({
      message: "Upload success",
      book: newBook,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Upload failed");
  }
}