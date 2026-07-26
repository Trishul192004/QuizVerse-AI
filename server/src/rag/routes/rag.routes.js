const express = require("express");
const router = express.Router();

const ragController = require("../controllers/rag.controller");
const { verifyToken } = require("../../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

console.log("verifyToken:", typeof verifyToken);
console.log("upload:", typeof upload);
console.log("upload.single:", typeof upload.single);

const uploadMiddleware = upload.single("file");

console.log("uploadMiddleware:", typeof uploadMiddleware);
console.log("uploadDocument:", typeof ragController.uploadDocument);

router.post(
    "/upload",
    verifyToken,
    uploadMiddleware,
    ragController.uploadDocument
);

router.get(
    "/documents",
    verifyToken,
    ragController.getDocuments
);

router.delete(
    "/document/:id",
    verifyToken,
    ragController.deleteDocument
);

router.post(
    "/ask",
    verifyToken,
    ragController.askQuestion
);

router.post(
    "/generate-quiz",
    verifyToken,
    ragController.generateQuiz
);

module.exports = router;