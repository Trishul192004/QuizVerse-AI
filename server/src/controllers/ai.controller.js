const { saveQuiz } = require("../services/quiz.service");
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
    console.log(req.body);
  try {
    // Generate quiz using AI
    const quiz = await generateQuiz(req.body);

    // Save to database
    const quizId = await saveQuiz({
      classroom_id: req.body.classroom_id,
      teacher_id: req.body.teacher_id,
      title: req.body.title,
      description: req.body.description,
      time_limit: req.body.time_limit,
      questions: quiz.questions,
    });

    return res.status(201).json({
      success: true,
      message: "Quiz generated successfully.",
      quizId,
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
const generateQuizPreview = async (req, res) => {
  try {
    const quiz = await generateQuiz(req.body);

    return res.json({
      success: true,
      data: quiz,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
module.exports = {
  testAI,
  createQuiz,
  generateQuizPreview,
};