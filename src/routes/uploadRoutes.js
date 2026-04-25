import express from "express";
import { upload } from "../middlewares/uploadMiddleware.js";
import { handleUpload } from "../controllers/uploadController.js";
import { testUpload } from "../controllers/testUploadController.js";


const router = express.Router();
router.get("/test-upload", testUpload);
router.post("/upload", upload.single("file"), handleUpload);

export default router;