const { z } = require("zod");

const SaveQuizSchema = z.object({
  classroomId: z.number(),
  title: z.string().min(3),
  description: z.string().optional().default(""),
  timeLimit: z.number().positive(),
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).length(4),
      correct_option: z.enum(["A", "B", "C", "D"]),
      explanation: z.string().optional(),
    })
  ),
});

module.exports = {
  SaveQuizSchema,
};