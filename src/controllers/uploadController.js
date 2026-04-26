import { uploadToBlob } from "../services/blobService.js";
import { deleteFile } from "../utils/cleanup.js";
import { generateHash } from "../utils/bookHash.js"
import Book from "../models/bookModel.js";
import { extractPage } from "../services/pdfService.js";



export async function handleUpload(req, res) {
  try {
    const file = req.file;
    const userId = req.headers.userid || "user_1";

    if (!file || file.mimetype !== "application/pdf") {
      return res.status(400).send("Only PDF allowed");
    }

    const bookId = await generateHash(file.path);
    let existingBook = await Book.findOne({ bookId });

    if (existingBook) {
      deleteFile(file.path);

      return res.json({
        message: "Book already exists",
        book: existingBook,
      });
    }
    
    const blobName = bookId+".pdf";

    //storing it in azure blob
    const fileUrl = await uploadToBlob(
      file.path,
      blobName
    );

    //storing the hash and the book url in db
    const newBook = await Book.create({
      bookId,
      userId,
      fileUrl,
      title: file.originalname,
    });

    const { totalPages, pages } = await extractPages(file.path);
    await savePages(bookId, pages);

    await Book.updateOne(
      { bookId },
      { totalPages }
    );

    deleteFile(file.path);

    res.json({
      message: "Upload success",
      fileUrl,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Upload failed");
  }
}