const express = require("express");
const router = express.Router();

const ragController = require("../controllers/rag.controller");
const { verifyToken } = require("../../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

console.log("verifyToken:", typeof verifyToken);
console.log("upload:", typeof upload);
console.log("upload.single:", typeof upload.single);
console.log("upload.single():", typeof upload.single("file"));
console.log("uploadDocument:", typeof ragController.uploadDocument);
console.log("getDocuments:", typeof ragController.getDocuments);
console.log("deleteDocument:", typeof ragController.deleteDocument);
console.log("askQuestion:", typeof ragController.askQuestion);
console.log("generateQuiz:", typeof ragController.generateQuiz);

const {
    uploadDocument,
    getDocuments,
    deleteDocument,
    askQuestion,
} = require("../controllers/rag.controller");

/*
==========================================
Teacher Routes
==========================================
*/

// Upload PDF
router.post(
    "/upload",
    verifyToken,
    upload.single("document"),
    uploadDocument
);

// Get uploaded documents
router.get(
    "/documents",
    verifyToken,
    getDocuments
);

// Delete document
router.delete(
    "/document/:id",
    verifyToken,
    deleteDocument
);

/*
==========================================
Teacher & Student
==========================================
*/

// Ask AI
router.post(
    "/ask",
    verifyToken,
    askQuestion
);

module.exports = router;