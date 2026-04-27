import OriginalPage from "../models/originalPageModel.js";
import Page from "../models/pageModel.js";
import Book from "../models/bookModel.js";
import { getPageText } from "../services/pageService.js";
import { simplifyText } from "../services/llmRouter.js";

export async function getPage(req, res) {
  try {
    const {
      bookId,
      page,
      model = "gemini",
      promptVersion = "v1",
    } = req.query;

    const pageNum = Number(page);

    // 1. check cache (model-aware)
    const cached = await Page.findOne({
      bookId,
      page: pageNum,
      model,
      promptVersion,
    });

    if (cached) {
      return res.json({
        source: "cache",
        text: cached.finalText,
      });
    }

    //  2. original cache
    let original = await OriginalPage.findOne({
      bookId,
      page: pageNum,
    });

    let text;

    if (original) {
      text = original.text;
    } else {
      const book = await Book.findOne({ bookId });

      if (!book) return res.status(404).send("Book not found");

      const data = await getPageText({
        bookId,
        fileUrl: book.fileUrl,
        page: pageNum,
      });

      text = data.text;

      if (!text || text.length < 5) {
        return res.json({ message: "Empty page" });
      }

      await OriginalPage.create({
        bookId,
        page: pageNum,
        text,
      });
    }

    //  3. LLM
    const simplifiedText = await simplifyText({
      text,
      model,
    });

    //  4. store
    await Page.create({
      bookId,
      page: pageNum,
      model,
      promptVersion,
      finalText: simplifiedText,
    });

    res.json({
      source: "fresh",
      text: simplifiedText,
    });

  } catch (err) {
    console.error(err);

    //  handle duplicate index race condition
    if (err.code === 11000) {
      const existing = await Page.findOne({
        bookId: req.query.bookId,
        page: Number(req.query.page),
        model: req.query.model || "gemini",
        promptVersion: req.query.promptVersion || "v1",
      });

      return res.json({
        source: "race-cache",
        text: existing.finalText,
      });
    }

    res.status(500).send("Failed");
  }
}