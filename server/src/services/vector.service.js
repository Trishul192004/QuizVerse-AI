const { HierarchicalNSW } = require("hnswlib-node");
const path = require("path");
const fs = require("fs");

const DIMENSION = 1536;

const INDEX_PATH = path.join(
    __dirname,
    "../../../storage/rag.index"
);

const index = new HierarchicalNSW("cosine", DIMENSION);

if (fs.existsSync(INDEX_PATH)) {
    index.readIndex(INDEX_PATH);
} else {
    index.initIndex(10000);
}

function saveIndex() {
    index.writeIndex(INDEX_PATH);
}

module.exports = {
    index,
    saveIndex,
};