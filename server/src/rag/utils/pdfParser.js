const fs = require("fs");
const pdf = require("pdf-parse");

const extractTextFromPDF = async (filePath) => {
    const fileBuffer = fs.readFileSync(filePath);

    const data = await pdf(fileBuffer);

    return data.text;
};

module.exports = {
    extractTextFromPDF,
};