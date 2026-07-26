const db = require("../../config/db");
const uploadDocument = async (req) => {
    if (!req.file) {
        throw new Error("No file uploaded");
    }

    const {
        originalname,
        filename,
        path,
        size,
        mimetype,
    } = req.file;

    // Temporary values until we integrate classrooms
    const classroomId = 1;
    const teacherId = req.user.id;

    const [result] = await db.query(
        `INSERT INTO rag_documents
        (
            classroom_id,
            teacher_id,
            original_name,
            stored_name,
            file_path,
            file_size,
            mime_type,
            upload_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            classroomId,
            teacherId,
            originalname,
            filename,
            path,
            size,
            mimetype,
            "READY",
        ]
    );

    return {
        success: true,
        message: "Document uploaded successfully",
        document: {
            id: result.insertId,
            originalName: originalname,
            storedName: filename,
        },
    };
};

const getDocuments = async () => {
    return {
        success: true,
        message: "Documents endpoint working",
        documents: [],
    };
};

const deleteDocument = async () => {
    return {
        success: true,
        message: "Document deleted successfully",
    };
};

const askQuestion = async () => {
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