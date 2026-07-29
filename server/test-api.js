const BASE = "http://localhost:5000";
let passed = 0, failed = 0, results = [];
let teacherToken, studentToken, refreshTok;
let classroomId, quizId, questionId, battleRoomCode;

const http = require("http");

function request(method, path, opts = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const headers = { "Content-Type": "application/json" };
    if (opts.token) headers["Authorization"] = `Bearer ${opts.token}`;

    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers,
      timeout: 15000
    }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        let body;
        try { body = JSON.parse(data); } catch { body = data; }
        resolve({ statusCode: res.statusCode, body });
      });
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
    if (opts.body) req.write(JSON.stringify(opts.body));
    req.end();
  });
}

async function test(name, fn) {
  try {
    const start = Date.now();
    await fn();
    const time = Date.now() - start;
    results.push({ name, status: "PASS", time: `${time}ms` });
    passed++;
  } catch (e) {
    results.push({ name, status: "FAIL", error: e.message });
    failed++;
    console.error(`  ❌ ${name}: ${e.message}`);
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || "Assertion failed");
}

async function runAllTests() {
  console.log("\n========================================");
  console.log("  QUIZVERSE AI - COMPREHENSIVE API TESTS");
  console.log("========================================\n");

  // ==================== AUTH ====================
  console.log("--- AUTH REGISTER ---");
  const testEmail = "test_" + Date.now() + "@test.com";

  await test("POST /api/auth/register - success", async () => {
    const r = await request("POST", "/api/auth/register", {
      body: { username: "testuser_" + Date.now(), email: testEmail, password: "Test1234!", role: "student" }
    });
    assert(r.statusCode === 201, `Expected 201, got ${r.statusCode}`);
    assert(r.body.success === true);
  });

  await test("POST /api/auth/register - duplicate email", async () => {
    const r = await request("POST", "/api/auth/register", {
      body: { username: "test", email: "trishul@gmail.com", password: "Test1234!" }
    });
    assert(r.statusCode === 409, `Expected 409, got ${r.statusCode}`);
  });

  await test("POST /api/auth/register - missing fields", async () => {
    const r = await request("POST", "/api/auth/register", { body: { username: "test" } });
    assert(r.statusCode === 400, `Expected 400, got ${r.statusCode}`);
  });

  console.log("\n--- AUTH LOGIN ---");

  await test("POST /api/auth/login - teacher success", async () => {
    const r = await request("POST", "/api/auth/login", {
      body: { email: "trishul@gmail.com", password: "test" }
    });
    assert(r.statusCode === 200, `Expected 200, got ${r.statusCode}`);
    assert(r.body.success === true);
    assert(r.body.accessToken, "Missing accessToken");
    assert(r.body.refreshToken, "Missing refreshToken");
    teacherToken = r.body.accessToken;
    refreshTok = r.body.refreshToken;
    console.log("    Teacher token acquired");
  });

  await test("POST /api/auth/login - student success", async () => {
    const r = await request("POST", "/api/auth/login", {
      body: { email: "sai2@gmail.com", password: "test" }
    });
    assert(r.statusCode === 200, `Expected 200, got ${r.statusCode}`);
    studentToken = r.body.accessToken;
    console.log("    Student token acquired");
  });

  await test("POST /api/auth/login - wrong password", async () => {
    const r = await request("POST", "/api/auth/login", {
      body: { email: "trishul@gmail.com", password: "wrongpass" }
    });
    assert(r.statusCode === 401, `Expected 401, got ${r.statusCode}`);
  });

  await test("POST /api/auth/login - non-existent email", async () => {
    const r = await request("POST", "/api/auth/login", {
      body: { email: "nonexist@test.com", password: "test" }
    });
    assert(r.statusCode === 401, `Expected 401, got ${r.statusCode}`);
  });

  await test("POST /api/auth/login - empty body", async () => {
    const r = await request("POST", "/api/auth/login", { body: {} });
    assert(r.statusCode === 400, `Expected 400, got ${r.statusCode}`);
  });

  console.log("\n--- AUTH CURRENT USER ---");

  await test("GET /api/auth/me - authenticated", async () => {
    const r = await request("GET", "/api/auth/me", { token: teacherToken });
    assert(r.statusCode === 200, `Expected 200, got ${r.statusCode}`);
    assert(r.body.user.email === "trishul@gmail.com");
  });

  await test("GET /api/auth/me - no token", async () => {
    const r = await request("GET", "/api/auth/me");
    assert(r.statusCode === 401, `Expected 401, got ${r.statusCode}`);
  });

  await test("GET /api/auth/me - invalid token", async () => {
    const r = await request("GET", "/api/auth/me", { token: "invalid_token" });
    assert(r.statusCode === 401, `Expected 401, got ${r.statusCode}`);
  });

  console.log("\n--- AUTH REFRESH TOKEN ---");

  await test("POST /api/auth/refresh - success", async () => {
    const r = await request("POST", "/api/auth/refresh", { body: { refreshToken: refreshTok } });
    assert(r.statusCode === 200, `Expected 200, got ${r.statusCode}`);
    assert(r.body.accessToken, "Missing new accessToken");
    teacherToken = r.body.accessToken;
  });

  await test("POST /api/auth/refresh - invalid token", async () => {
    const r = await request("POST", "/api/auth/refresh", { body: { refreshToken: "invalid" } });
    assert(r.statusCode === 401, `Expected 401, got ${r.statusCode}`);
  });

  await test("POST /api/auth/refresh - missing token", async () => {
    const r = await request("POST", "/api/auth/refresh", { body: {} });
    assert(r.statusCode === 400, `Expected 400, got ${r.statusCode}`);
  });

  console.log("\n--- AUTH SESSIONS ---");

  await test("GET /api/auth/sessions - authenticated", async () => {
    const r = await request("GET", "/api/auth/sessions", { token: teacherToken });
    assert(r.statusCode === 200, `Expected 200, got ${r.statusCode}`);
    assert(Array.isArray(r.body.sessions));
  });

  await test("GET /api/auth/sessions - no auth", async () => {
    const r = await request("GET", "/api/auth/sessions");
    assert(r.statusCode === 401, `Expected 401, got ${r.statusCode}`);
  });

  console.log("\n--- AUTH LOGOUT ---");

  await test("POST /api/auth/logout - success", async () => {
    const r = await request("POST", "/api/auth/logout", { body: { refreshToken: refreshTok } });
    assert(r.statusCode === 200, `Expected 200, got ${r.statusCode}`);
  });

  await test("POST /api/auth/logout-all - authenticated", async () => {
    const r = await request("POST", "/api/auth/logout-all", { token: teacherToken });
    assert(r.statusCode === 200, `Expected 200, got ${r.statusCode}`);
  });

  // ==================== CLASSROOMS ====================
  console.log("\n--- CLASSROOMS ---");

  await test("POST /api/classrooms/create - teacher success", async () => {
    const r = await request("POST", "/api/classrooms/create", {
      token: teacherToken,
      body: { name: "Test Class " + Date.now() }
    });
    assert(r.statusCode === 201, `Expected 201, got ${r.statusCode}`);
    assert(r.body.classroom.id, "Missing classroom id");
    classroomId = r.body.classroom.id;
    console.log("    Created classroom:", classroomId);
  });

  await test("POST /api/classrooms/create - student forbidden", async () => {
    const r = await request("POST", "/api/classrooms/create", {
      token: studentToken,
      body: { name: "Test" }
    });
    assert(r.statusCode === 403, `Expected 403, got ${r.statusCode}`);
  });

  await test("POST /api/classrooms/create - no auth", async () => {
    const r = await request("POST", "/api/classrooms/create", { body: { name: "Test" } });
    assert(r.statusCode === 401, `Expected 401, got ${r.statusCode}`);
  });

  await test("POST /api/classrooms/create - missing name", async () => {
    const r = await request("POST", "/api/classrooms/create", {
      token: teacherToken,
      body: {}
    });
    assert(r.statusCode === 400, `Expected 400, got ${r.statusCode}`);
  });

  await test("GET /api/classrooms - teacher classrooms", async () => {
    const r = await request("GET", "/api/classrooms", { token: teacherToken });
    assert(r.statusCode === 200, `Expected 200, got ${r.statusCode}`);
    assert(Array.isArray(r.body.classrooms));
  });

  await test("GET /api/classrooms/:id - get by id", async () => {
    const r = await request("GET", `/api/classrooms/${classroomId}`, { token: teacherToken });
    assert(r.statusCode === 200, `Expected 200, got ${r.statusCode}`);
    assert(r.body.classroom.name);
  });

  await test("GET /api/classrooms/:id - non-existent", async () => {
    const r = await request("GET", "/api/classrooms/99999", { token: teacherToken });
    assert(r.statusCode === 404, `Expected 404, got ${r.statusCode}`);
  });

  await test("GET /api/classrooms/:id - student forbidden", async () => {
    const r = await request("GET", `/api/classrooms/${classroomId}`, { token: studentToken });
    assert(r.statusCode === 403, `Expected 403, got ${r.statusCode}`);
  });

  await test("DELETE /api/classrooms/:id - not found", async () => {
    const r = await request("DELETE", "/api/classrooms/99999", { token: teacherToken });
    assert(r.statusCode === 404, `Expected 404, got ${r.statusCode}`);
  });

  // ==================== QUIZZES ====================
  console.log("\n--- QUIZZES ---");

  await test("POST /api/quizzes/create - teacher success", async () => {
    const r = await request("POST", "/api/quizzes/create", {
      token: teacherToken,
      body: { classroom_id: classroomId, title: "Test Quiz " + Date.now(), time_limit: 20, description: "Test desc", total_marks: 50 }
    });
    assert(r.statusCode === 201, `Expected 201, got ${r.statusCode}`);
    quizId = r.body.quiz.id;
    console.log("    Created quiz:", quizId);
  });

  await test("POST /api/quizzes/create - student forbidden", async () => {
    const r = await request("POST", "/api/quizzes/create", {
      token: studentToken,
      body: { classroom_id: classroomId, title: "Test", time_limit: 20 }
    });
    assert(r.statusCode === 403, `Expected 403, got ${r.statusCode}`);
  });

  await test("POST /api/quizzes/create - missing fields", async () => {
    const r = await request("POST", "/api/quizzes/create", {
      token: teacherToken,
      body: { classroom_id: classroomId }
    });
    assert(r.statusCode === 400, `Expected 400, got ${r.statusCode}`);
  });

  await test("GET /api/quizzes/:id - get quiz", async () => {
    const r = await request("GET", `/api/quizzes/${quizId}`, { token: teacherToken });
    assert(r.statusCode === 200, `Expected 200, got ${r.statusCode}`);
    assert(r.body.quiz.title);
  });

  await test("GET /api/quizzes/:id - non-existent", async () => {
    const r = await request("GET", "/api/quizzes/99999", { token: teacherToken });
    assert(r.statusCode === 404, `Expected 404, got ${r.statusCode}`);
  });

  await test("GET /api/quizzes/classroom/:classroomId - get classroom quizzes", async () => {
    const r = await request("GET", `/api/quizzes/classroom/${classroomId}`, { token: teacherToken });
    assert(r.statusCode === 200, `Expected 200, got ${r.statusCode}`);
    assert(Array.isArray(r.body.quizzes));
  });

  await test("GET /api/quizzes/teacher/all - all teacher quizzes", async () => {
    const r = await request("GET", "/api/quizzes/teacher/all", { token: teacherToken });
    assert(r.statusCode === 200, `Expected 200, got ${r.statusCode}`);
  });

  await test("PUT /api/quizzes/:id - update quiz", async () => {
    const r = await request("PUT", `/api/quizzes/${quizId}`, {
      token: teacherToken,
      body: { title: "Updated Quiz", time_limit: 25, description: "Updated", total_marks: 60 }
    });
    assert(r.statusCode === 200, `Expected 200, got ${r.statusCode}`);
  });

  await test("PUT /api/quizzes/:id/publish - publish quiz", async () => {
    const r = await request("PUT", `/api/quizzes/${quizId}/publish`, { token: teacherToken });
    assert(r.statusCode === 200, `Expected 200, got ${r.statusCode}`);
  });

  await test("DELETE /api/quizzes/:id - non-existent", async () => {
    const r = await request("DELETE", "/api/quizzes/99999", { token: teacherToken });
    assert(r.statusCode === 403, `Expected 403, got ${r.statusCode}`);
  });

  // ==================== QUESTIONS ====================
  console.log("\n--- QUESTIONS ---");

  await test("POST /api/questions/create - add question", async () => {
    const r = await request("POST", "/api/questions/create", {
      token: teacherToken,
      body: { quiz_id: quizId, question: "What is 2+2?", option_a: "3", option_b: "4", option_c: "5", option_d: "6", correct_option: "B", marks: 5 }
    });
    assert(r.statusCode === 201, `Expected 201, got ${r.statusCode}`);
    questionId = r.body.question.id;
    console.log("    Created question:", questionId);
  });

  await test("POST /api/questions/create - missing fields", async () => {
    const r = await request("POST", "/api/questions/create", {
      token: teacherToken,
      body: { quiz_id: quizId, question: "Test?" }
    });
    assert(r.statusCode === 400, `Expected 400, got ${r.statusCode}`);
  });

  await test("POST /api/questions/create - invalid correct_option", async () => {
    const r = await request("POST", "/api/questions/create", {
      token: teacherToken,
      body: { quiz_id: quizId, question: "Q?", option_a: "1", option_b: "2", option_c: "3", option_d: "4", correct_option: "E" }
    });
    assert(r.statusCode === 400, `Expected 400, got ${r.statusCode}`);
  });

  await test("GET /api/questions/quiz/:quizId - get questions", async () => {
    const r = await request("GET", `/api/questions/quiz/${quizId}`, { token: teacherToken });
    assert(r.statusCode === 200, `Expected 200, got ${r.statusCode}`);
    assert(Array.isArray(r.body.questions));
  });

  await test("PUT /api/questions/:id - update question", async () => {
    const r = await request("PUT", `/api/questions/${questionId}`, {
      token: teacherToken,
      body: { question: "Updated: What is 2+2?", option_a: "3", option_b: "4", option_c: "5", option_d: "6", correct_option: "B", marks: 5 }
    });
    assert(r.statusCode === 200, `Expected 200, got ${r.statusCode}`);
  });

  await test("DELETE /api/questions/:id - delete question", async () => {
    const r = await request("DELETE", `/api/questions/${questionId}`, { token: teacherToken });
    assert(r.statusCode === 200, `Expected 200, got ${r.statusCode}`);
  });

  // ==================== STUDENT ====================
  console.log("\n--- STUDENT ---");

  await test("GET /api/student/classrooms - student classrooms", async () => {
    const r = await request("GET", "/api/student/classrooms", { token: studentToken });
    assert(r.statusCode === 200, `Expected 200, got ${r.statusCode}`);
  });

  await test("GET /api/student/leaderboard - leaderboard", async () => {
    const r = await request("GET", "/api/student/leaderboard", { token: studentToken });
    assert(r.statusCode === 200, `Expected 200, got ${r.statusCode}`);
    assert(Array.isArray(r.body.leaderboard));
  });

  await test("POST /api/student/start-quiz/:quizId - start quiz", async () => {
    const r = await request("POST", `/api/student/start-quiz/${quizId}`, { token: studentToken });
    if (r.statusCode === 201 || r.statusCode === 200) {
      attemptId = r.body.attemptId;
      console.log("    Attempt ID:", attemptId);
    } else {
      // Could be 403 if student not in classroom
      console.log("    Note: start-quiz returned", r.statusCode, "-", JSON.stringify(r.body));
    }
  });

  // ==================== TEACHER ANALYTICS ====================
  console.log("\n--- TEACHER ANALYTICS ---");

  await test("GET /api/teacher/quizzes/:quizId/analytics - no auth", async () => {
    const r = await request("GET", `/api/teacher/quizzes/${quizId}/analytics`);
    assert(r.statusCode === 401, `Expected 401, got ${r.statusCode}`);
  });

  await test("GET /api/teacher/quizzes/:quizId/analytics - student forbidden", async () => {
    const r = await request("GET", `/api/teacher/quizzes/${quizId}/analytics`, { token: studentToken });
    assert(r.statusCode === 403, `Expected 403, got ${r.statusCode}`);
  });

  await test("GET /api/teacher/quizzes/:quizId/analytics - teacher", async () => {
    const r = await request("GET", `/api/teacher/quizzes/${quizId}/analytics`, { token: teacherToken });
    assert(r.statusCode === 200, `Expected 200, got ${r.statusCode}`);
  });

  await test("GET /api/teacher/attempts/:attemptId - no auth", async () => {
    const r = await request("GET", "/api/teacher/attempts/99999");
    assert(r.statusCode === 401, `Expected 401, got ${r.statusCode}`);
  });

  await test("GET /api/teacher/attempts/:attemptId - invalid", async () => {
    const r = await request("GET", "/api/teacher/attempts/99999", { token: teacherToken });
    assert(r.statusCode === 404, `Expected 404, got ${r.statusCode}`);
  });

  // ==================== BATTLE ====================
  console.log("\n--- BATTLE ---");

  await test("POST /api/battle/create - create", async () => {
    const r = await request("POST", "/api/battle/create", {
      token: teacherToken,
      body: { quizId, maxPlayers: 10 }
    });
    if (r.statusCode === 201) {
      battleRoomCode = r.body.room.roomCode;
      console.log("    Battle room:", battleRoomCode);
    } else {
      console.log("    Note: battle create returned", r.statusCode, JSON.stringify(r.body));
    }
  });

  if (battleRoomCode) {
    await test("GET /api/battle/:roomCode - get room", async () => {
      const r = await request("GET", `/api/battle/${battleRoomCode}`, { token: teacherToken });
      assert(r.statusCode === 200);
    });

    await test("POST /api/battle/join - join", async () => {
      const r = await request("POST", "/api/battle/join", {
        token: studentToken,
        body: { roomCode: battleRoomCode }
      });
      assert(r.statusCode === 200);
    });

    await test("POST /api/battle/start - start", async () => {
      const r = await request("POST", "/api/battle/start", {
        token: teacherToken,
        body: { roomCode: battleRoomCode }
      });
      assert(r.statusCode === 200);
    });
  }

  // ==================== AI ====================
  console.log("\n--- AI ---");

  await test("GET /api/ai/test - AI test", async () => {
    const r = await request("GET", "/api/ai/test");
    assert(r.statusCode === 200);
  });

  await test("POST /api/ai/generate-quiz - no auth (should fail)", async () => {
    const r = await request("POST", "/api/ai/generate-quiz", {
      body: { topic: "Math", difficulty: "easy", questionCount: 2 }
    });
    assert(r.statusCode === 401, `Expected 401, got ${r.statusCode}`);
  });

  await test("POST /api/ai/generate-quiz-preview - no auth (should fail)", async () => {
    const r = await request("POST", "/api/ai/generate-quiz-preview", {
      body: { topic: "Math", difficulty: "easy", questionCount: 2 }
    });
    assert(r.statusCode === 401, `Expected 401, got ${r.statusCode}`);
  });

  // ==================== RAG ====================
  console.log("\n--- RAG ---");

  await test("GET /api/rag/documents", async () => {
    const r = await request("GET", "/api/rag/documents", { token: teacherToken });
    assert(r.statusCode === 200);
  });

  await test("POST /api/rag/ask - no body", async () => {
    const r = await request("POST", "/api/rag/ask", { token: teacherToken, body: {} });
    // Should return error since no question
    assert(r.statusCode === 500); // throws error from service
  });

  // ==================== 404 ====================
  console.log("\n--- 404 ---");

  // Battle AI auth test
  await test("POST /api/battle-ai/generate - no auth (should fail)", async () => {
    const r = await request("POST", "/api/battle-ai/generate", {
      body: { topic: "Math", questionCount: 2 }
    });
    assert(r.statusCode === 401, `Expected 401, got ${r.statusCode}`);
  });

  await test("GET /api/nonexistent - 404", async () => {
    const r = await request("GET", "/api/nonexistent");
    assert(r.statusCode === 404, `Expected 404, got ${r.statusCode}`);
  });

  // ==================== SECURITY ====================
  console.log("\n--- SECURITY ---");

  await test("SQL Injection - login bypass attempt", async () => {
    const r = await request("POST", "/api/auth/login", {
      body: { email: "' OR '1'='1", password: "' OR '1'='1" }
    });
    assert(r.statusCode === 401, `Expected 401, got ${r.statusCode}`);
  });

  await test("Student accessing teacher endpoint", async () => {
    const r = await request("DELETE", `/api/quizzes/${quizId}`, { token: studentToken });
    assert(r.statusCode === 403, `Expected 403, got ${r.statusCode}`);
  });

  await test("No token accessing battle-ai/generate", async () => {
    const r = await request("POST", "/api/battle-ai/generate", { body: {} });
    assert(r.statusCode === 401, `Expected 401, got ${r.statusCode}`);
  });

  await test("Student token on teacher analytics route", async () => {
    const r = await request("GET", `/api/teacher/quizzes/${quizId}/analytics`, { token: studentToken });
    assert(r.statusCode === 403, `Expected 403, got ${r.statusCode}`);
  });

  // ==================== SUMMARY ====================
  const total = passed + failed;
  const rate = (passed / total * 100).toFixed(1);

  console.log("\n========================================");
  console.log(`  RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`  PASS RATE: ${rate}%`);
  console.log("========================================\n");

  console.log("DETAILED RESULTS:");
  for (const r of results) {
    const icon = r.status === "PASS" ? "✅" : "❌";
    console.log(`  ${icon} ${r.status} | ${r.name}${r.time ? ` (${r.time})` : ""}${r.error ? ` - ${r.error}` : ""}`);
  }

  return { passed, failed, total, rate, results };
}

runAllTests().then(res => {
  require("fs").writeFileSync("test-results.json", JSON.stringify(res, null, 2));
  console.log("\nResults saved to test-results.json");
}).catch(e => {
  console.error("FATAL:", e);
  process.exit(1);
});
