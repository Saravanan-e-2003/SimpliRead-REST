import { uploadToBlob } from "../services/blobService.js";
import { deleteFile } from "../utils/cleanup.js";

export async function handleUpload(req, res) {
  try {
    const file = req.file;

    if (!file || file.mimetype !== "application/pdf") {
      return res.status(400).send("Only PDF allowed");
    }

    const fileUrl = await uploadToBlob(
      file.path,
      file.originalname
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