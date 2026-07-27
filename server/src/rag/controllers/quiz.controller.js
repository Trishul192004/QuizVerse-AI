const quizService = require("../services/quiz.service");

exports.publishQuiz = async (req, res) => {

    try {

        const success =
            await quizService.publishQuiz(
                req.params.id,
                req.user.id
            );

        if (!success) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found."
            });
        }

        res.json({
            success: true,
            message: "Quiz published successfully."
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};