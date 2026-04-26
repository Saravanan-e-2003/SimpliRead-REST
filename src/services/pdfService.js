import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";


export async function extractPage(filePath, pageNumber) {
  const data = new Uint8Array(fs.readFileSync(filePath));

  const pdf = await pdfjsLib.getDocument({ data }).promise;

  if (pageNumber > pdf.numPages) {
    throw new Error("Page out of range");
  }

  const page = await pdf.getPage(pageNumber);

  const content = await page.getTextContent();

  const text = content.items
    .map(item => item.str)
    .join(" ")
    .trim();

  return {
    page: pageNumber,
    text,
    totalPages: pdf.numPages,
  };
}