const { generateQuiz } = require("../services/ai.service");

const generateBattleQuiz = async (req, res) => {
  try {
    const quiz = await generateQuiz({
      topic: req.body.topic,
      difficulty: req.body.difficulty,
      number_of_questions: req.body.questionCount,
      timer: req.body.timer,
      mode: "battle",
    });

    return res.status(200).json({
      success: true,
      questions: quiz.questions,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  generateBattleQuiz,
};