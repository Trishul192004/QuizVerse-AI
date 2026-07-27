    const ragService = require("../services/rag.service");

    const uploadDocument = async (req, res) => {
    try {

        const result = await ragService.uploadDocument(req);

        res.status(201).json(result);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const getDocuments = async (req, res) => {
    try {

        const result = await ragService.getDocuments(req);

        res.json(result);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const deleteDocument = async (req, res) => {
    try {

        const result = await ragService.deleteDocument(req);

        res.json(result);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const askQuestion = async (req, res) => {
    try {

        const result = await ragService.askQuestion(req);

        res.json(result);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

const generateQuizFromDocument = async (req, res) => {
    try {

        const result =
            await ragService.generateQuizFromDocument(req);

        res.json(result);

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
    generateQuizFromDocument,
};