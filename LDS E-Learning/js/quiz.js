// --- LDS TIMER & ASSESSMENT ENGINE ---

const Quiz = {
  activeQuiz: null,
  activeCourseId: null,
  timerInterval: null,
  secondsLeft: 0,
  userAnswers: {},

  initQuiz(courseId) {
    const quizzes = window.DB.get("quizzes");
    const quiz = quizzes.find(q => q.courseId === courseId);
    
    if (!quiz) {
      document.getElementById("quiz-pane-content").innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <p style="color: var(--text-muted);">No assessments have been built for this course yet.</p>
        </div>
      `;
      return;
    }

    this.activeQuiz = quiz;
    this.activeCourseId = courseId;
    this.userAnswers = {};

    this.renderStartScreen();
  },

  renderStartScreen() {
    const pane = document.getElementById("quiz-pane-content");
    if (!pane) return;

    pane.innerHTML = `
      <div style="text-align: center; padding: 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
        <h3>🏁 ${this.activeQuiz.title}</h3>
        <p style="max-width:500px; color: var(--text-muted);">
          This is a timed quiz testing your understanding of the curriculum content. You must complete the quiz within the time limit.
        </p>
        <div style="display: flex; gap: 2rem; margin: 1rem 0;">
          <div>
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-secondary);">${this.activeQuiz.questions.length}</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">Questions</div>
          </div>
          <div>
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-secondary);">${this.activeQuiz.duration} min</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">Time Limit</div>
          </div>
        </div>
        <button class="btn btn-primary" onclick="Quiz.startTimerAndRender()">Start Assessment</button>
      </div>
    `;
  },

  startTimerAndRender() {
    this.secondsLeft = this.activeQuiz.duration * 60;
    this.startCountdown();
    this.renderQuestions();
  },

  startCountdown() {
    clearInterval(this.timerInterval);
    this.updateTimerUI();

    this.timerInterval = setInterval(() => {
      this.secondsLeft--;
      this.updateTimerUI();

      if (this.secondsLeft <= 0) {
        clearInterval(this.timerInterval);
        window.showToast("Time is up! Submitting answers automatically.", "warning");
        this.submitQuiz();
      }
    }, 1000);
  },

  updateTimerUI() {
    const indicator = document.getElementById("quiz-timer-indicator");
    if (!indicator) return;

    const min = Math.floor(this.secondsLeft / 60);
    const sec = this.secondsLeft % 60;
    indicator.innerHTML = `⏳ Time Remaining: <strong>${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}</strong>`;
    indicator.style.display = "block";
  },

  renderQuestions() {
    const pane = document.getElementById("quiz-pane-content");
    if (!pane) return;

    const questionsHtml = this.activeQuiz.questions.map((q, qIndex) => {
      const optionsHtml = q.options.map((opt, optIndex) => `
        <label style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: var(--radius-sm); margin-bottom: 0.5rem; cursor: pointer; transition: all var(--transition-fast);">
          <input type="radio" name="question_${qIndex}" value="${optIndex}" onchange="Quiz.selectAnswer(${qIndex}, ${optIndex})" style="accent-color: var(--color-primary);">
          <span>${opt}</span>
        </label>
      `).join('');

      return `
        <div class="card" style="margin-bottom: 1.5rem; text-align: left;">
          <h4 style="margin-bottom: 1rem;">Q${qIndex + 1}. ${q.question}</h4>
          <div>${optionsHtml}</div>
        </div>
      `;
    }).join('');

    pane.innerHTML = `
      <div id="quiz-timer-indicator" style="background: rgba(239, 68, 68, 0.15); border:1px solid var(--accent-danger); color: var(--accent-danger); padding:0.75rem; text-align:center; border-radius:var(--radius-sm); font-weight:700; margin-bottom:1.5rem; display:none;"></div>
      <div style="max-height: 500px; overflow-y: auto; padding-right:0.5rem; margin-bottom: 1.5rem;">
        ${questionsHtml}
      </div>
      <button class="btn btn-primary" style="width: 100%" onclick="Quiz.submitQuiz()">Submit Assessment</button>
    `;

    this.updateTimerUI();
  },

  selectAnswer(qIndex, optIndex) {
    this.userAnswers[qIndex] = optIndex;
  },

  submitQuiz() {
    clearInterval(this.timerInterval);
    const indicator = document.getElementById("quiz-timer-indicator");
    if (indicator) indicator.style.display = "none";

    let correctCount = 0;
    const total = this.activeQuiz.questions.length;

    this.activeQuiz.questions.forEach((q, qIndex) => {
      if (this.userAnswers[qIndex] === q.answerIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / total) * 100);
    const passed = score >= 80; // 80% passing grade

    const user = window.Session.getCurrentUser();
    if (user) {
      // 1. Update Progress Row
      const progressList = window.DB.get("progress");
      const prog = progressList.find(p => p.userId === user.id && p.courseId === this.activeCourseId);

      if (prog) {
        if (!prog.completedQuizzes.includes(this.activeQuiz.id)) {
          prog.completedQuizzes.push(this.activeQuiz.id);
        }

        // Check if entire course is completed (all lessons + quiz passed)
        const lessons = window.DB.get("lessons").filter(l => l.courseId === this.activeCourseId);
        const allLessonsFinished = lessons.every(l => prog.completedLessons.includes(l.id));

        if (allLessonsFinished && passed && !prog.completed) {
          prog.completed = true;
          prog.completedAt = new Date().toISOString();
          
          // Generate Certificate Row
          const certId = `CERT-${Math.floor(10000 + Math.random() * 90000)}-${this.activeCourseId.substring(2).toUpperCase()}`;
          const verifyHash = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
          
          const newCert = {
            id: certId,
            userId: user.id,
            userName: user.name,
            courseId: this.activeCourseId,
            courseTitle: window.DB.get("courses").find(c => c.id === this.activeCourseId)?.title || "Course",
            date: new Date().toISOString(),
            verifyHash
          };
          window.DB.insert("certificates", newCert);
          window.showToast("Congratulations! Course Fully Completed! Certificate Generated.", "success");
        }

        window.DB.update("progress", prog.id, {
          completedQuizzes: prog.completedQuizzes,
          completed: prog.completed,
          completedAt: prog.completedAt
        });
      }

      // 2. Award Points
      if (passed) {
        window.awardPoints(30, `Passing Course Assessment (${score}%)`);
      }
    }

    this.renderResults(score, correctCount, total, passed);
  },

  renderResults(score, correct, total, passed) {
    const pane = document.getElementById("quiz-pane-content");
    if (!pane) return;

    let resultTitle = passed ? "🎉 Assessment Passed!" : "❌ Assessment Failed";
    let themeColor = passed ? "var(--accent-success)" : "var(--accent-danger)";
    let desc = passed 
      ? `Brilliant work! You scored ${score}%. If you've finished all lectures, you can now retrieve your certificate.`
      : `You scored ${score}%. You need at least 80% to pass. Review the lectures and try again.`;

    pane.innerHTML = `
      <div style="text-align: center; padding: 2rem; display: flex; flex-direction: column; align-items: center; gap: 1.25rem;">
        <h3 style="color: ${themeColor}">${resultTitle}</h3>
        <div style="font-size: 4rem; font-weight: 800; color: ${themeColor}; font-family: var(--font-heading);">${score}%</div>
        <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 450px;">${desc}</p>
        <div style="font-size:0.9rem; font-weight:500;">
          Correct Answers: <strong>${correct} / ${total}</strong>
        </div>
        <div style="display:flex; gap:1rem; width:100%; max-width:320px; margin-top:1rem;">
          <button class="btn btn-secondary" style="flex:1" onclick="Quiz.initQuiz('${this.activeCourseId}')">Retake Quiz</button>
          ${passed ? `<button class="btn btn-primary" style="flex:1" onclick="window.location.reload()">Back to Class</button>` : ''}
        </div>
      </div>
    `;
  }
};

window.Quiz = Quiz;
