import OriginalPage from "../models/originalPageModel.js";
import Page from "../models/pageModel.js";
import { getPageText } from "../services/pageService.js";
import  Book  from "../models/bookModel.js"

export async function getPage(req, res) {
  try {
    const { bookId, page } = req.query;

    // 1. check simplified
    const cached = await Page.findOne({ bookId, page });

    if (cached) {
      return res.json({
        source: "simplified-cache",
        text: cached.finalText,
      });
    }

    // 2. check original
    let original = await OriginalPage.findOne({ bookId, page });

    let text;

    if (original) {
      text = original.text;
    } else {
      // 3. extract
      const book = await Book.findOne({ bookId });

      if (!book) {
        return res.status(404).send("Book not found");
      }

      const data = await getPageText({
        bookId,
        fileUrl: book.fileUrl,
        page: Number(page),
      });

      text = data.text;

      if (!text || text.length < 5) {
        return res.json({ message: "Empty page" });
      }

      // store original
      await OriginalPage.create({
        bookId,
        page,
        text,
      });
    }

    // 4. send to LLM (temp skip)
    const simplifiedText = text;

    // 5. store simplified
    await Page.create({
      bookId,
      page,
      finalText: simplifiedText,
    });

    res.json({
      source: "fresh",
      text: simplifiedText,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed");
  }
}