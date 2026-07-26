const { extractTextFromPDF } = require("./src/rag/utils/pdfParser");

(async () => {
    try {
        const text = await extractTextFromPDF(
            "./uploads/rag/1785045797379-846292742.pdf"
        );

        console.log(text);
    } catch (err) {
        console.error(err);
    }
})();