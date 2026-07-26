const ragService = require("../services/rag.service");

console.log("RAG Service exports:", Object.keys(ragService));
console.log(
  "generateQuizFromDocument:",
  typeof ragService.generateQuizFromDocument
);

const uploadDocument = async (req, res) => {
    try {
        const result = await ragService.uploadDocument(req);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getDocuments = async (req, res) => {
    try {
        const result = await ragService.getDocuments(req);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteDocument = async (req, res) => {
    try {
        const result = await ragService.deleteDocument(req);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const askQuestion = async (req, res) => {
    try {
        const result = await ragService.askQuestion(req);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const generateQuiz = async (req, res) => {
    try {
        const result = await ragService.generateQuizFromDocument(req);

        res.status(200).json(result);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    uploadDocument,
    getDocuments,
    deleteDocument,
    askQuestion,
    generateQuiz,
};