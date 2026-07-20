const express = require("express");
const router = express.Router();

const { testAI } = require("../controllers/ai.controller");

router.get("/test", testAI);

module.exports = router;