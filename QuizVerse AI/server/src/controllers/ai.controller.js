const {
  generateText,
  generateQuiz,
} = require("../services/ai.service");

const testAI = async (req, res) => {
  try {
    const reply = await generateText(
      "Say hello to QuizVerse AI."
    );

    res.json({
      success: true,
      response: reply,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const createQuiz = async (req, res) => {
  try {
    const quiz = await generateQuiz(req.body);

    return res.json({
      success: true,
      data: quiz,
    });
  } catch (err) {
    console.error("========== CREATE QUIZ ERROR ==========");
    console.error(err);
    console.error("======================================");

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  testAI,
  createQuiz,
};