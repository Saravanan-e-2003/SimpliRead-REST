import path from "path";
import { uploadToBlob } from "../services/blobService.js";
// import { deleteFile } from "../utils/cleanup.js";

export async function testUpload(req, res) {
  try {
    // 👉 manually placed file
    const filePath = path.resolve("uploads/test.pdf");

    const fileName = "test.pdf";

    const fileUrl = await uploadToBlob(filePath, fileName);

    // optional: delete after test
    // deleteFile(filePath);

    res.json({
      message: "Test upload success",
      fileUrl,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Test upload failed");
  }
}