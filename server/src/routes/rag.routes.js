const express = require("express");
const router = express.Router();

const verifyToken = require("../../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

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