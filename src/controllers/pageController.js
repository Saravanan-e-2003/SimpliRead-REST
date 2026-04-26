import Book from "../models/bookModel.js";
import Page from "../models/pageModel.js";
import { getPageText } from "../services/pageService.js";

export async function getPage(req, res) {
  try {
    const { bookId, page } = req.query;

    //  1. check simplified cache
    const cached = await Page.findOne({ bookId, page });

    if (cached) {
      return res.json({
        source: "cache",
        text: cached.finalText,
      });
    }

    //  get book
    const book = await Book.findOne({ bookId });

    if (!book) {
      return res.status(404).send("Book not found");
    }

    // extract original text
    const { text, totalPages } = await getPageText({
      bookId,
      fileUrl: book.fileUrl,
      page: Number(page),
    });

    if (!text || text.length < 5) {
      return res.json({ message: "Empty page" });
    }

    //  (TEMP) no LLM yet
    const simplifiedText = text; // replace later

    //  save cache
    await Page.create({
      bookId,
      page,
      finalText: simplifiedText,
    });

    res.json({
      source: "fresh",
      text: simplifiedText,
      totalPages,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to get page");
  }
}