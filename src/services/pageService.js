import { downloadPdf } from "./fileService.js";
import { extractPage } from "./pdfService.js";
import { getLocalPath, isCached, addToCache, getPath } from "../utils/fileCache.js";

export async function getPageText(book) {
  const { bookId, fileUrl, page } = book;

  let localPath;

  // check cache
  if (isCached(bookId)) {
    localPath = getPath(bookId);
  } else {
    localPath = getLocalPath(bookId);

    await downloadPdf(fileUrl, localPath);

    addToCache(bookId, localPath);
  }

  //  extract page
  const data = await extractPage(localPath, page);

  return data;
}