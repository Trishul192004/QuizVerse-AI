const uploadDocument = async (req) => {
    return {
        success: true,
        message: "Upload endpoint working",
        file: req.file || null,
    };
};

const getDocuments = async (req) => {
    return {
        success: true,
        message: "Documents endpoint working",
        documents: [],
    };
};

const deleteDocument = async (req) => {
    return {
        success: true,
        message: "Document deleted successfully",
    };
};

const askQuestion = async (req) => {
    return {
        success: true,
        message: "Ask endpoint working",
        answer: "RAG pipeline not implemented yet.",
    };
};

module.exports = {
    uploadDocument,
    getDocuments,
    deleteDocument,
    askQuestion,
};