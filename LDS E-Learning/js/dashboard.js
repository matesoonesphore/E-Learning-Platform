// --- LDS DASHBOARD CONTROL PANEL ENGINE ---

const Dashboard = {
  init() {
    const user = window.Session.getCurrentUser();
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    this.renderSidebar(user.role);
    this.showSection("overview");
  },

  renderSidebar(role) {
    const container = document.getElementById("dashboard-sidebar");
    if (!container) return;

    let links = `
      <div class="sidebar-link active" onclick="Dashboard.showSection('overview')">📊 Overview</div>
    `;

    if (role === "student") {
      links += `
        <div class="sidebar-link" onclick="Dashboard.showSection('my-courses')">📚 My Courses</div>
        <div class="sidebar-link" onclick="Dashboard.showSection('certificates')">🎓 Certificates</div>
        <div class="sidebar-link" onclick="Dashboard.showSection('leaderboard')">🏆 Leaderboard</div>
      `;
    } else if (role === "instructor") {
      links += `
        <div class="sidebar-link" onclick="Dashboard.showSection('course-builder')">🛠️ Course Builder</div>
        <div class="sidebar-link" onclick="Dashboard.showSection('analytics')">📈 Analytics</div>
        <div class="sidebar-link" onclick="Dashboard.showSection('announcements')">📢 Announcements</div>
      `;
    } else if (role === "admin") {
      links += `
        <div class="sidebar-link" onclick="Dashboard.showSection('manage-users')">👥 Manage Users</div>
        <div class="sidebar-link" onclick="Dashboard.showSection('manage-courses')">📂 Manage Courses</div>
        <div class="sidebar-link" onclick="Dashboard.showSection('platform-stats')">🏢 System Stats</div>
      `;
    }

    container.innerHTML = links;

    // Sidebar navigation click binding
    document.querySelectorAll(".sidebar-link").forEach(link => {
      link.addEventListener("click", (e) => {
        document.querySelectorAll(".sidebar-link").forEach(l => l.classList.remove("active"));
        e.currentTarget.classList.add("active");
      });
    });
  },

  showSection(sectionId) {
    const main = document.getElementById("dashboard-main-content");
    if (!main) return;

    const user = window.Session.getCurrentUser();

    if (sectionId === "overview") {
      if (user.role === "student") this.renderStudentOverview(user, main);
      if (user.role === "instructor") this.renderInstructorOverview(user, main);
      if (user.role === "admin") this.renderAdminOverview(user, main);
    } else {
      // Route specific sections
      if (sectionId === "my-courses") this.renderStudentCourses(user, main);
      if (sectionId === "certificates") this.renderStudentCertificates(user, main);
      if (sectionId === "leaderboard") this.renderLeaderboard(main);
      if (sectionId === "course-builder") this.renderCourseBuilder(user, main);
      if (sectionId === "analytics") this.renderInstructorAnalytics(user, main);
      if (sectionId === "announcements") this.renderInstructorAnnouncements(user, main);
      if (sectionId === "manage-users") this.renderAdminUsers(main);
      if (sectionId === "manage-courses") this.renderAdminCourses(main);
      if (sectionId === "platform-stats") this.renderAdminPlatformStats(main);
    }
  },

  /* ================= STUDENT DASHBOARD ================= */
  renderStudentOverview(user, main) {
    const progress = window.DB.get("progress").filter(p => p.userId === user.id);
    const completedCount = progress.filter(p => p.completed).length;
    const certificates = window.DB.get("certificates").filter(c => c.userId === user.id);

    // Calculate streak from mock logic or user creation date
    const streak = 3; 

    main.innerHTML = `
      <h2>Welcome Back, ${user.name} 👋</h2>
      <p style="color: var(--text-muted); margin-bottom: 2rem;">Track your progress, continue where you left off, and explore new modules.</p>

      <div class="stats-grid">
        <div class="card stat-card">
          <div class="stat-val">${progress.length}</div>
          <div class="stat-label">Enrolled Courses</div>
        </div>
        <div class="card stat-card">
          <div class="stat-val">${completedCount}</div>
          <div class="stat-label">Completed Courses</div>
        </div>
        <div class="card stat-card">
          <div class="stat-val">${user.points || 0}</div>
          <div class="stat-label">Gamification Points</div>
        </div>
        <div class="card stat-card">
          <div class="stat-val">🔥 ${streak} Days</div>
          <div class="stat-label">Daily Streak</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <h3>Recent Activity</h3>
          <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem;">
            ${progress.length === 0 ? "<p>No recent activity found.</p>" : 
              progress.map(p => {
                const c = window.DB.get("courses").find(x => x.id === p.courseId);
                return `
                  <div style="display:flex; justify-content:space-between; font-size:0.9rem; padding: 0.5rem; background:rgba(255,255,255,0.02); border-radius:4px;">
                    <span>Studied <strong>${c?.title.split(':')[0]}</strong></span>
                    <span style="color: var(--text-muted);">${p.completedLessons.length} lessons read</span>
                  </div>
                `;
              }).join('')
            }
          </div>
        </div>
        
        <div class="card">
          <h3>AI Recommendations</h3>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;">Tailored recommendations based on your bio & pathways.</p>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;" id="ai-rec-container">
            ${this.getAIRecommendations(user)}
          </div>
        </div>
      </div>
    `;
  },

  getAIRecommendations(user) {
    const courses = window.DB.get("courses").filter(c => c.isApproved);
    const progress = window.DB.get("progress").filter(p => p.userId === user.id);
    const enrolledIds = progress.map(p => p.courseId);
    
    // Recommend approved courses that the user hasn't enrolled in
    const pool = courses.filter(c => !enrolledIds.includes(c.id));
    if (pool.length === 0) return "<p>You have enrolled in all courses! Brilliant work!</p>";

    return pool.slice(0, 2).map(c => `
      <div style="padding:0.75rem; background: rgba(6, 182, 212, 0.08); border: 1px solid var(--color-secondary); border-radius: var(--radius-sm); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h4 style="font-size:0.95rem;">${c.title}</h4>
          <span style="font-size:0.8rem; color:var(--text-muted);">${c.category} - ${c.level}</span>
        </div>
        <button class="btn btn-accent btn-xs" onclick="Courses.handleEnrollmentClick('${c.id}')">Enroll</button>
      </div>
    `).join('');
  },

  renderStudentCourses(user, main) {
    const progress = window.DB.get("progress").filter(p => p.userId === user.id);

    if (progress.length === 0) {
      main.innerHTML = `
        <h2>My Enrolled Courses</h2>
        <div style="text-align: center; padding: 4rem;">
          <p style="color: var(--text-muted); margin-bottom: 1.5rem;">You are not enrolled in any courses yet.</p>
          <a href="courses.html" class="btn btn-primary">Browse Marketplace</a>
        </div>
      `;
      return;
    }

    const cardsHtml = progress.map(prog => {
      const course = window.DB.get("courses").find(c => c.id === prog.courseId);
      const lessons = window.DB.get("lessons").filter(l => l.courseId === prog.courseId);
      
      const totalLessons = lessons.length;
      const completed = prog.completedLessons.length;
      const percentage = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

      return `
        <div class="card" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
          <div>
            <span style="font-size:0.75rem; text-transform:uppercase; color:var(--color-secondary); font-weight:700;">${course?.category}</span>
            <h3 style="margin: 0.5rem 0;">${course?.title}</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1rem;">by ${course?.instructorName}</p>
          </div>
          <div>
            <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:0.25rem;">
              <span>Progress</span>
              <span>${percentage}% (${completed}/${totalLessons})</span>
            </div>
            <div style="background: rgba(255,255,255,0.05); height: 8px; border-radius: 50px; overflow: hidden; margin-bottom: 1.5rem;">
              <div style="background: var(--color-primary); height: 100%; width: ${percentage}%;"></div>
            </div>
            <button class="btn btn-primary" style="width:100%" onclick="window.location.href='course-details.html?id=${course.id}'">Study Now</button>
          </div>
        </div>
      `;
    }).join('');

    main.innerHTML = `
      <h2>My Enrolled Courses</h2>
      <p style="color: var(--text-muted); margin-bottom: 2rem;">Choose a course to resume learning.</p>
      <div class="grid-3">${cardsHtml}</div>
    `;
  },

  renderStudentCertificates(user, main) {
    const certs = window.DB.get("certificates").filter(c => c.userId === user.id);

    if (certs.length === 0) {
      main.innerHTML = `
        <h2>My Certificates</h2>
        <div style="text-align: center; padding: 4rem;">
          <p style="color: var(--text-muted);">You have not earned any certificates yet. Complete a course quiz with a perfect pass rate to unlock your credentials.</p>
        </div>
      `;
      return;
    }

    const listHtml = certs.map(cert => `
      <div class="card" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
        <div>
          <h4>🎓 ${cert.courseTitle}</h4>
          <p style="font-size:0.85rem; color:var(--text-muted);">Issued on: ${new Date(cert.date).toLocaleDateString()} | Verification Hash: ${cert.verifyHash}</p>
        </div>
        <button class="btn btn-accent btn-xs" onclick="window.open('course-details.html?id=${cert.courseId}&cert=true')">Download PDF</button>
      </div>
    `).join('');

    main.innerHTML = `
      <h2>My Certificates</h2>
      <p style="color: var(--text-muted); margin-bottom: 2rem;">Verifiable digital diplomas earned on LDS E-Learning Platform.</p>
      <div style="display:flex; flex-direction:column;">${listHtml}</div>
    `;
  },

  renderLeaderboard(main) {
    const users = window.DB.get("users").sort((a,b) => (b.points || 0) - (a.points || 0));

    const rows = users.map((u, i) => `
      <div class="leaderboard-row">
        <span class="leaderboard-rank">#${i+1}</span>
        <span class="leaderboard-name">${u.name} ${u.role === 'admin' ? '(Admin)' : u.role === 'instructor' ? '(Instructor)' : ''}</span>
        <span class="leaderboard-points">${u.points || 0} pts</span>
      </div>
    `).join('');

    main.innerHTML = `
      <h2>LDS Leaderboard</h2>
      <p style="color: var(--text-muted); margin-bottom: 2rem;">Top-performing profiles across the global database.</p>
      <div class="card" style="max-width: 600px;">
        <div class="leaderboard-list">
          ${rows}
        </div>
      </div>
    `;
  },

  /* ================= INSTRUCTOR DASHBOARD ================= */
  renderInstructorOverview(user, main) {
    const courses = window.DB.get("courses").filter(c => c.instructorId === user.id);
    const progressList = window.DB.get("progress");

    // Gather statistics
    const activeCourseIds = courses.map(c => c.id);
    const totalEnrollments = progressList.filter(p => activeCourseIds.includes(p.courseId)).length;
    const totalCompletions = progressList.filter(p => activeCourseIds.includes(p.courseId) && p.completed).length;

    main.innerHTML = `
      <h2>Welcome Back, Instructor ${user.name} 🎓</h2>
      <p style="color: var(--text-muted); margin-bottom: 2rem;">Build curriculum modules, monitor performance metrics, and submit updates.</p>

      <div class="stats-grid">
        <div class="card stat-card">
          <div class="stat-val">${courses.length}</div>
          <div class="stat-label">Total Courses Created</div>
        </div>
        <div class="card stat-card">
          <div class="stat-val">${totalEnrollments}</div>
          <div class="stat-label">Student Enrollments</div>
        </div>
        <div class="card stat-card">
          <div class="stat-val">${totalCompletions}</div>
          <div class="stat-label">Course Completions</div>
        </div>
        <div class="card stat-card">
          <div class="stat-val">$${(totalEnrollments * 29.99 * 0.8).toFixed(2)}</div>
          <div class="stat-label">Estimated Payout Earnings</div>
        </div>
      </div>
    `;
  },

  renderCourseBuilder(user, main) {
    const myCourses = window.DB.get("courses").filter(c => c.instructorId === user.id);

    main.innerHTML = `
      <h2>Course Curriculum Builder</h2>
      <p style="color: var(--text-muted); margin-bottom: 2rem;">Create new course cards, lecture modules, and quizzes.</p>

      <div class="grid-2">
        <!-- Create Course Form -->
        <div class="card">
          <h3>Create New Course</h3>
          <form id="new-course-form" onsubmit="Dashboard.handleCreateCourse(event)" style="margin-top:1.5rem;">
            <div class="form-group">
              <label>Course Title</label>
              <input type="text" id="c-title" class="form-input" required placeholder="e.g. Master React Hooks">
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea id="c-desc" class="form-input" rows="3" required placeholder="Describe course outcomes..."></textarea>
            </div>
            <div class="form-group">
              <label>Category</label>
              <select id="c-category" class="form-input">
                <option value="Web Development">Web Development</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Design">Design</option>
              </select>
            </div>
            <div class="form-group">
              <label>Skill Level</label>
              <select id="c-level" class="form-input">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div class="form-group">
              <label>Language</label>
              <select id="c-lang" class="form-input">
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="rw">Kinyarwanda</option>
              </select>
            </div>
            <div class="form-group">
              <label>Price ($ USD)</label>
              <input type="number" id="c-price" class="form-input" step="0.01" required value="29.99">
            </div>
            <button class="btn btn-primary" style="width:100%">Create Course Structure</button>
          </form>
        </div>

        <div style="display:flex; flex-direction:column; gap:2rem;">
          <!-- Create Lesson Form -->
          <div class="card">
            <h3>Add Lesson Module</h3>
            <form id="new-lesson-form" onsubmit="Dashboard.handleCreateLesson(event)" style="margin-top:1.5rem;">
              <div class="form-group">
                <label>Select Target Course</label>
                <select id="l-target-course" class="form-input">
                  ${myCourses.map(c => `<option value="${c.id}">${c.title}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>Lesson Title</label>
                <input type="text" id="l-title" class="form-input" required placeholder="e.g. Setting up Context API">
              </div>
              <div class="form-group">
                <label>Summary / Outline</label>
                <input type="text" id="l-desc" class="form-input" required placeholder="Brief description...">
              </div>
              <div class="form-group">
                <label>Mock Video Link (MP4)</label>
                <input type="text" id="l-video" class="form-input" required value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4">
              </div>
              <div class="form-group">
                <label>Duration (Minutes)</label>
                <input type="number" id="l-duration" class="form-input" required value="15">
              </div>
              <button class="btn btn-secondary" style="width:100%">Add Lesson</button>
            </form>
          </div>

          <!-- Create Quiz Form -->
          <div class="card">
            <h3>Add Quiz Question</h3>
            <form id="new-quiz-form" onsubmit="Dashboard.handleCreateQuizQuestion(event)" style="margin-top:1.5rem;">
              <div class="form-group">
                <label>Select Course Quiz</label>
                <select id="q-target-course" class="form-input">
                  ${myCourses.map(c => `<option value="${c.id}">${c.title}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>Question text</label>
                <input type="text" id="q-text" class="form-input" required placeholder="Which hook handles side effects?">
              </div>
              <div class="form-group">
                <label>Options (Comma Separated)</label>
                <input type="text" id="q-options" class="form-input" required placeholder="useState, useEffect, useContext, useReducer">
              </div>
              <div class="form-group">
                <label>Correct Answer Index (0-3)</label>
                <input type="number" id="q-correct" class="form-input" min="0" max="3" required value="1">
              </div>
              <button class="btn btn-accent" style="width:100%">Add Question to Quiz</button>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  handleCreateCourse(e) {
    e.preventDefault();
    const user = window.Session.getCurrentUser();
    
    const title = document.getElementById("c-title").value;
    const description = document.getElementById("c-desc").value;
    const category = document.getElementById("c-category").value;
    const level = document.getElementById("c-level").value;
    const language = document.getElementById("c-lang").value;
    const price = parseFloat(document.getElementById("c-price").value);

    const newCourse = {
      id: "c_" + Date.now(),
      title,
      description,
      instructorId: user.id,
      instructorName: user.name,
      category,
      level,
      language,
      price,
      rating: 5.0,
      thumbnail: "",
      pathway: "",
      isApproved: false, // Pending Admin Approval
      createdAt: new Date().toISOString()
    };

    window.DB.insert("courses", newCourse);
    window.showToast("Course created successfully! Pending administrative verification.", "success");
    e.target.reset();
    this.showSection("course-builder");
  },

  handleCreateLesson(e) {
    e.preventDefault();
    const courseId = document.getElementById("l-target-course").value;
    if (!courseId) {
      window.showToast("Please create a course structure first.", "warning");
      return;
    }

    const title = document.getElementById("l-title").value;
    const description = document.getElementById("l-desc").value;
    const videoUrl = document.getElementById("l-video").value;
    const duration = parseInt(document.getElementById("l-duration").value);

    const existingLessons = window.DB.get("lessons").filter(l => l.courseId === courseId);
    
    const newLesson = {
      id: "l_" + Date.now(),
      courseId,
      title,
      description,
      videoUrl,
      pdfUrl: "",
      duration,
      order: existingLessons.length + 1
    };

    window.DB.insert("lessons", newLesson);
    window.showToast("Lesson module successfully added!", "success");
    e.target.reset();
  },

  handleCreateQuizQuestion(e) {
    e.preventDefault();
    const courseId = document.getElementById("q-target-course").value;
    if (!courseId) {
      window.showToast("Please create a course structure first.", "warning");
      return;
    }

    const question = document.getElementById("q-text").value;
    const optionsStr = document.getElementById("q-options").value;
    const answerIndex = parseInt(document.getElementById("q-correct").value);

    const options = optionsStr.split(',').map(opt => opt.trim());
    if (options.length < 2) {
      window.showToast("Please provide at least 2 comma-separated options.", "warning");
      return;
    }

    const quizzes = window.DB.get("quizzes");
    let quiz = quizzes.find(q => q.courseId === courseId);

    if (quiz) {
      quiz.questions.push({
        id: "q_" + Date.now(),
        question,
        options,
        answerIndex,
        points: 10
      });
      window.DB.update("quizzes", quiz.id, { questions: quiz.questions });
    } else {
      const newQuiz = {
        id: "q_" + Date.now(),
        courseId,
        title: "Timed Assessment Quiz",
        duration: 5,
        questions: [{
          id: "q_" + Date.now(),
          question,
          options,
          answerIndex,
          points: 10
        }]
      };
      window.DB.insert("quizzes", newQuiz);
    }

    window.showToast("Question added to course Timed Quiz assessment!", "success");
    e.target.reset();
  },

  renderInstructorAnalytics(user, main) {
    const courses = window.DB.get("courses").filter(c => c.instructorId === user.id);
    const progressList = window.DB.get("progress");

    const rows = courses.map(course => {
      const enrollments = progressList.filter(p => p.courseId === course.id).length;
      const completions = progressList.filter(p => p.courseId === course.id && p.completed).length;
      const earnings = enrollments * course.price * 0.8;

      return `
        <tr>
          <td style="padding:1rem; border-bottom:1px solid var(--border-color); font-weight:600;">${course.title}</td>
          <td style="padding:1rem; border-bottom:1px solid var(--border-color);">${enrollments}</td>
          <td style="padding:1rem; border-bottom:1px solid var(--border-color);">${completions}</td>
          <td style="padding:1rem; border-bottom:1px solid var(--border-color); color:var(--accent-success); font-weight:700;">$${earnings.toFixed(2)}</td>
          <td style="padding:1rem; border-bottom:1px solid var(--border-color);">${course.isApproved ? "🟢 Active" : "🟡 Pending approval"}</td>
        </tr>
      `;
    }).join('');

    main.innerHTML = `
      <h2>Instructor Curriculum Analytics</h2>
      <p style="color: var(--text-muted); margin-bottom: 2rem;">Real-time views and enrollment conversions.</p>

      <div class="card" style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; text-align:left;">
          <thead>
            <tr>
              <th style="padding:1rem; background:rgba(0,0,0,0.1); border-bottom:1px solid var(--border-color);">Course</th>
              <th style="padding:1rem; background:rgba(0,0,0,0.1); border-bottom:1px solid var(--border-color);">Enrollments</th>
              <th style="padding:1rem; background:rgba(0,0,0,0.1); border-bottom:1px solid var(--border-color);">Completions</th>
              <th style="padding:1rem; background:rgba(0,0,0,0.1); border-bottom:1px solid var(--border-color);">Net Revenue (80%)</th>
              <th style="padding:1rem; background:rgba(0,0,0,0.1); border-bottom:1px solid var(--border-color);">Status</th>
            </tr>
          </thead>
          <tbody>
            ${rows || "<tr><td colspan='5' style='padding:2rem; text-align:center;'>No courses built yet.</td></tr>"}
          </tbody>
        </table>
      </div>
    `;
  },

  renderInstructorAnnouncements(user, main) {
    const myCourses = window.DB.get("courses").filter(c => c.instructorId === user.id);
    const annList = window.DB.get("announcements");

    const activeIds = myCourses.map(c => c.id);
    const filteredAnn = annList.filter(a => activeIds.includes(a.courseId));

    main.innerHTML = `
      <h2>Announcements Board</h2>
      <p style="color: var(--text-muted); margin-bottom: 2rem;">Publish notices to enrolled students.</p>

      <div class="grid-2">
        <div class="card">
          <h3>Create Announcement</h3>
          <form onsubmit="Dashboard.handleCreateAnnouncement(event)" style="margin-top:1.5rem; display:flex; flex-direction:column; gap:1rem;">
            <div class="form-group">
              <label>Select Course</label>
              <select id="a-target-course" class="form-input">
                ${myCourses.map(c => `<option value="${c.id}">${c.title}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Title</label>
              <input type="text" id="a-title" class="form-input" required placeholder="e.g. Scheduled Maintenance">
            </div>
            <div class="form-group">
              <label>Bulletin Content</label>
              <textarea id="a-content" class="form-input" rows="4" required placeholder="Write detailed notice here..."></textarea>
            </div>
            <button class="btn btn-primary">Broadcast Announcement</button>
          </form>
        </div>

        <div class="card">
          <h3>Active Bulletins</h3>
          <div style="margin-top:1rem; display:flex; flex-direction:column; gap:1rem;">
            ${filteredAnn.length === 0 ? "<p>No active bulletins.</p>" : 
              filteredAnn.map(ann => {
                const c = myCourses.find(x => x.id === ann.courseId);
                return `
                  <div style="padding:0.75rem; background:rgba(255,255,255,0.02); border:1px solid var(--border-color); border-radius:4px;">
                    <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--color-secondary);">
                      <span>Course: ${c?.title.split(':')[0]}</span>
                      <span>${new Date(ann.date).toLocaleDateString()}</span>
                    </div>
                    <h4 style="margin: 0.25rem 0;">${ann.title}</h4>
                    <p style="font-size:0.85rem; color:var(--text-muted);">${ann.content}</p>
                  </div>
                `;
              }).join('')
            }
          </div>
        </div>
      </div>
    `;
  },

  handleCreateAnnouncement(e) {
    e.preventDefault();
    const courseId = document.getElementById("a-target-course").value;
    const title = document.getElementById("a-title").value;
    const content = document.getElementById("a-content").value;

    if (!courseId) {
      window.showToast("Please create a course structure first.", "warning");
      return;
    }

    const newAnn = {
      id: "ann_" + Date.now(),
      courseId,
      title,
      content,
      date: new Date().toISOString()
    };

    window.DB.insert("announcements", newAnn);
    window.showToast("Announcement broadcasted successfully!", "success");
    e.target.reset();
    this.showSection("announcements");
  },

  /* ================= ADMIN DASHBOARD ================= */
  renderAdminOverview(user, main) {
    const users = window.DB.get("users");
    const courses = window.DB.get("courses");
    const payments = window.DB.get("payments");

    const totalRevenue = payments.reduce((acc, pay) => acc + pay.amount, 0);

    main.innerHTML = `
      <h2>System Administrator Dashboard</h2>
      <p style="color: var(--text-muted); margin-bottom: 2rem;">Moderate course approvals, review users, and manage system stats.</p>

      <div class="stats-grid">
        <div class="card stat-card">
          <div class="stat-val">${users.length}</div>
          <div class="stat-label">Total Users</div>
        </div>
        <div class="card stat-card">
          <div class="stat-val">${courses.length}</div>
          <div class="stat-label">Total Courses</div>
        </div>
        <div class="card stat-card">
          <div class="stat-val">${courses.filter(c=>!c.isApproved).length}</div>
          <div class="stat-label">Pending Approval</div>
        </div>
        <div class="card stat-card">
          <div class="stat-val" style="color:var(--accent-success);">$${totalRevenue.toFixed(2)}</div>
          <div class="stat-label">Total Earnings Gross</div>
        </div>
      </div>
    `;
  },

  renderAdminUsers(main) {
    const users = window.DB.get("users");

    const rows = users.map(u => `
      <tr>
        <td style="padding:0.75rem; border-bottom:1px solid var(--border-color); font-weight:600;">${u.name}</td>
        <td style="padding:0.75rem; border-bottom:1px solid var(--border-color);">${u.email}</td>
        <td style="padding:0.75rem; border-bottom:1px solid var(--border-color); text-transform:capitalize;">${u.role}</td>
        <td style="padding:0.75rem; border-bottom:1px solid var(--border-color);">${u.role === 'instructor' ? (u.isApproved ? "Approved" : "Pending") : "N/A"}</td>
        <td style="padding:0.75rem; border-bottom:1px solid var(--border-color); display:flex; gap:0.5rem;">
          ${u.role === 'instructor' && !u.isApproved ? `<button class="btn btn-primary btn-xs" onclick="Dashboard.approveInstructor('${u.id}')">Approve</button>` : ''}
          <button class="btn btn-secondary btn-xs" onclick="Dashboard.impersonateUser('${u.id}')">Impersonate</button>
          ${u.id !== 'u_admin' ? `<button class="btn btn-accent btn-xs" onclick="Dashboard.deleteUser('${u.id}')">Remove</button>` : ''}
        </td>
      </tr>
    `).join('');

    main.innerHTML = `
      <h2>Manage Platform Users</h2>
      <p style="color: var(--text-muted); margin-bottom: 2rem;">Approve instructors, delete profiles, or enter Impersonation Mode.</p>

      <div class="card" style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; text-align:left;">
          <thead>
            <tr>
              <th style="padding:0.75rem; background:rgba(0,0,0,0.1); border-bottom:1px solid var(--border-color);">Name</th>
              <th style="padding:0.75rem; background:rgba(0,0,0,0.1); border-bottom:1px solid var(--border-color);">Email</th>
              <th style="padding:0.75rem; background:rgba(0,0,0,0.1); border-bottom:1px solid var(--border-color);">Role</th>
              <th style="padding:0.75rem; background:rgba(0,0,0,0.1); border-bottom:1px solid var(--border-color);">Approval</th>
              <th style="padding:0.75rem; background:rgba(0,0,0,0.1); border-bottom:1px solid var(--border-color);">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  },

  approveInstructor(userId) {
    window.DB.update("users", userId, { isApproved: true });
    window.showToast("Instructor approved successfully!", "success");
    this.renderAdminUsers(document.getElementById("dashboard-main-content"));
  },

  deleteUser(userId) {
    if (confirm("Remove user and all associated learning data?")) {
      window.DB.delete("users", userId);
      window.showToast("User successfully removed from system.", "warning");
      this.renderAdminUsers(document.getElementById("dashboard-main-content"));
    }
  },

  impersonateUser(userId) {
    const user = window.DB.get("users").find(u => u.id === userId);
    if (!user) return;
    localStorage.setItem("edusphere_impersonated_user", JSON.stringify(user));
    window.showToast(`Entering Impersonation Mode as ${user.name}`, "success");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1200);
  },

  renderAdminCourses(main) {
    const courses = window.DB.get("courses");

    const rows = courses.map(c => `
      <tr>
        <td style="padding:0.75rem; border-bottom:1px solid var(--border-color); font-weight:600;">${c.title}</td>
        <td style="padding:0.75rem; border-bottom:1px solid var(--border-color);">${c.instructorName}</td>
        <td style="padding:0.75rem; border-bottom:1px solid var(--border-color);">${c.category}</td>
        <td style="padding:0.75rem; border-bottom:1px solid var(--border-color);">$${c.price}</td>
        <td style="padding:0.75rem; border-bottom:1px solid var(--border-color);">${c.isApproved ? "🟢 Approved" : "🟡 Pending"}</td>
        <td style="padding:0.75rem; border-bottom:1px solid var(--border-color); display:flex; gap:0.5rem;">
          ${!c.isApproved ? `<button class="btn btn-primary btn-xs" onclick="Dashboard.toggleCourseApproval('${c.id}', true)">Approve</button>` : `<button class="btn btn-secondary btn-xs" onclick="Dashboard.toggleCourseApproval('${c.id}', false)">Suspend</button>`}
          <button class="btn btn-accent btn-xs" onclick="Dashboard.removeCourse('${c.id}')">Delete</button>
        </td>
      </tr>
    `).join('');

    main.innerHTML = `
      <h2>Manage Course Catalog</h2>
      <p style="color: var(--text-muted); margin-bottom: 2rem;">Approve instructor content submissions or delete courses.</p>

      <div class="card" style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; text-align:left;">
          <thead>
            <tr>
              <th style="padding:0.75rem; background:rgba(0,0,0,0.1); border-bottom:1px solid var(--border-color);">Title</th>
              <th style="padding:0.75rem; background:rgba(0,0,0,0.1); border-bottom:1px solid var(--border-color);">Instructor</th>
              <th style="padding:0.75rem; background:rgba(0,0,0,0.1); border-bottom:1px solid var(--border-color);">Category</th>
              <th style="padding:0.75rem; background:rgba(0,0,0,0.1); border-bottom:1px solid var(--border-color);">Price</th>
              <th style="padding:0.75rem; background:rgba(0,0,0,0.1); border-bottom:1px solid var(--border-color);">Approval</th>
              <th style="padding:0.75rem; background:rgba(0,0,0,0.1); border-bottom:1px solid var(--border-color);">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  },

  toggleCourseApproval(courseId, state) {
    window.DB.update("courses", courseId, { isApproved: state });
    window.showToast(state ? "Course published!" : "Course suspended.", "success");
    this.renderAdminCourses(document.getElementById("dashboard-main-content"));
  },

  removeCourse(courseId) {
    if (confirm("Delete this course and all associated lectures?")) {
      window.DB.delete("courses", courseId);
      
      const lessons = window.DB.get("lessons");
      window.DB.set("lessons", lessons.filter(l => l.courseId !== courseId));

      const quizzes = window.DB.get("quizzes");
      window.DB.set("quizzes", quizzes.filter(q => q.courseId !== courseId));

      window.showToast("Course successfully deleted.", "warning");
      this.renderAdminCourses(document.getElementById("dashboard-main-content"));
    }
  },

  renderAdminPlatformStats(main) {
    const progress = window.DB.get("progress");
    const completions = progress.filter(p => p.completed).length;
    const rates = progress.length > 0 ? Math.round((completions / progress.length) * 100) : 0;

    main.innerHTML = `
      <h2>Global System Statistics</h2>
      <p style="color: var(--text-muted); margin-bottom: 2rem;">Audit database records and platform conversion metrics.</p>

      <div class="grid-2">
        <div class="card">
          <h3>E-learning Engagement Metrics</h3>
          <div style="margin-top:1.5rem; display:flex; flex-direction:column; gap:1rem;">
            <div>
              <div style="display:flex; justify-content:space-between; font-size:0.9rem; font-weight:600; margin-bottom:0.25rem;">
                <span>Conversion Pass Rate</span>
                <span>${rates}%</span>
              </div>
              <div style="background: rgba(255,255,255,0.05); height: 10px; border-radius:50px; overflow:hidden;">
                <div style="background:var(--color-primary); height:100%; width:${rates}%;"></div>
              </div>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span>Enrolled Seats:</span>
              <strong>${progress.length} students</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span>Course Certificates Issued:</span>
              <strong>${window.DB.get("certificates").length} diplomas</strong>
            </div>
          </div>
        </div>

        <div class="card">
          <h3>Audit Log Timeline</h3>
          <div style="margin-top:1rem; max-height:220px; overflow-y:auto; display:flex; flex-direction:column; gap:0.5rem; font-family:monospace; font-size:0.8rem; color:var(--text-muted);">
            <div>[${new Date().toLocaleTimeString()}] ADMIN: Accessed dashboard parameters</div>
            <div>[${new Date(Date.now() - 3600000).toLocaleTimeString()}] SEED: Data files loaded into LocalStorage</div>
            <div>[${new Date(Date.now() - 7200000).toLocaleTimeString()}] AUTH: Alex Mercer registered student account</div>
          </div>
        </div>
      </div>
    `;
  }
};

window.Dashboard = Dashboard;
