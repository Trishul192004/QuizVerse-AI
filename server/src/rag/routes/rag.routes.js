const express = require("express");
const router = express.Router();

const { verifyToken } = require("../../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const {
  uploadDocument,
  getDocuments,
  deleteDocument,
  askQuestion,
} = require("../controllers/rag.controller");

router.post(
  "/upload",
  verifyToken,
  upload.single("document"),
  uploadDocument
);

router.get("/documents", verifyToken, getDocuments);

router.delete("/document/:id", verifyToken, deleteDocument);
console.log("verifyToken:", typeof verifyToken);
console.log("upload.single:", typeof upload.single);
console.log("uploadDocument:", typeof uploadDocument);
console.log("getDocuments:", typeof getDocuments);
console.log("deleteDocument:", typeof deleteDocument);
console.log("askQuestion:", typeof askQuestion);

router.post("/ask", verifyToken, askQuestion);

module.exports = router;