const { z } = require("zod");

const QuestionSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string()).length(4),
  answer: z.string().min(1),
  explanation: z.string().min(1),
});

const QuizSchema = z.object({
  questions: z.array(QuestionSchema).min(1),
});

module.exports = {
  QuizSchema,
};