const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(process.cwd(), "uploads", "rag");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    },
});

const fileFilter = (req, file, cb) => {

    if (file.mimetype !== "application/pdf") {

        return cb(new Error("Only PDF files are allowed"));

    }

    cb(null, true);
};

module.exports = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 20 * 1024 * 1024,
    },

});