const { generateText } = require("../services/ai.service");

const testAI = async (req, res) => {
  try {
    const reply = await generateText(
      "Say hello to QuizVerse AI in one sentence."
    );

    return res.status(200).json({
      success: true,
      response: reply,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  testAI,
};