const [loading, setLoading] = useState(false);

const [quiz, setQuiz] = useState<any>(null);

const [form, setForm] = useState({
  title: "",
  topic: "",
  difficulty: "Easy",
  questionCount: 5,
  classroom_id: 0,
  description: "",
  time_limit: 20,
});

const handleGenerate = async () => {
  try {
    setLoading(true);

    const res = await generateQuizPreview(form);

    setQuiz(res.data);
  } finally {
    setLoading(false);
  }
};

await generateQuiz({
    ...form,
    questions: quiz.questions
});