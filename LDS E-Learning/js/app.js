// --- LDS E-LEARNING PLATFORM CORE APPLICATION ENGINE ---

// 1. Embedded Seed Data Fallbacks (for robust local file:// loading without web servers)
const FALLBACK_DATA = {
  users: [
    {
      "id": "u_student",
      "email": "student@edusphere.com",
      "password": "password123",
      "name": "Alex Mercer",
      "role": "student",
      "bio": "Enthusiastic developer learning the stacks of the future.",
      "avatar": "",
      "preferences": { "language": "en", "theme": "dark", "contrast": "normal" },
      "points": 120,
      "badges": ["Beginner Learner", "Quiz Master"],
      "isApproved": true,
      "createdAt": "2026-01-15T08:30:00.000Z"
    },
    {
      "id": "u_instructor",
      "email": "instructor@edusphere.com",
      "password": "password123",
      "name": "Dr. Sarah Connor",
      "role": "instructor",
      "bio": "Professor of Robotics and Computer Science with 12 years of industry experience.",
      "avatar": "",
      "preferences": { "language": "en", "theme": "light", "contrast": "normal" },
      "points": 450,
      "badges": ["Course Champion"],
      "isApproved": true,
      "createdAt": "2026-01-10T12:00:00.000Z"
    },
    {
      "id": "u_admin",
      "email": "admin@edusphere.com",
      "password": "password123",
      "name": "LDS Admin",
      "role": "admin",
      "bio": "Main platform administrator and course validator.",
      "avatar": "",
      "preferences": { "language": "en", "theme": "dark", "contrast": "high" },
      "points": 1000,
      "badges": [],
      "isApproved": true,
      "createdAt": "2025-12-01T00:00:00.000Z"
    }
  ],
  courses: [
    {
      "id": "c_html",
      "title": "Introduction to HTML5 & Web Structure",
      "description": "Learn the absolute essentials of website building. Create your first semantic pages, understand tags, attributes, links, images, and tables.",
      "instructorId": "u_instructor",
      "instructorName": "Dr. Sarah Connor",
      "category": "Web Development",
      "level": "Beginner",
      "language": "en",
      "price": 19.99,
      "rating": 4.8,
      "thumbnail": "assets/course_html.png",
      "pathway": "Web Developer Path",
      "isApproved": true,
      "createdAt": "2026-02-01T09:00:00.000Z"
    },
    {
      "id": "c_css",
      "title": "Mastering CSS3: Styling & Responsive Design",
      "description": "Unleash your creative side. Style your web layouts, create modern glassmorphic cards, design grid-based layouts, and master responsive media queries.",
      "instructorId": "u_instructor",
      "instructorName": "Dr. Sarah Connor",
      "category": "Web Development",
      "level": "Beginner",
      "language": "en",
      "price": 29.99,
      "rating": 4.7,
      "thumbnail": "assets/course_css.png",
      "pathway": "Web Developer Path",
      "isApproved": true,
      "createdAt": "2026-02-15T10:00:00.000Z"
    },
    {
      "id": "c_js",
      "title": "Modern JavaScript: Fundamentals to ES6+",
      "description": "Program interactive web logic. Learn variables, loops, arrays, objects, functions, DOM manipulation, asynchronous programming, and LocalStorage APIs.",
      "instructorId": "u_instructor",
      "instructorName": "Dr. Sarah Connor",
      "category": "Web Development",
      "level": "Intermediate",
      "language": "en",
      "price": 49.99,
      "rating": 4.9,
      "thumbnail": "assets/course_js.png",
      "pathway": "Web Developer Path",
      "isApproved": true,
      "createdAt": "2026-03-01T11:00:00.000Z"
    },
    {
      "id": "c_ai_basics",
      "title": "Introduction to AI & Prompt Engineering",
      "description": "Learn the basics of Artificial Intelligence. Dive into neural networks, Large Language Models (LLMs), and how to engineer powerful prompts to get the best out of bots.",
      "instructorId": "u_instructor",
      "instructorName": "Dr. Sarah Connor",
      "category": "Artificial Intelligence",
      "level": "Beginner",
      "language": "en",
      "price": 39.99,
      "rating": 4.6,
      "thumbnail": "assets/course_ai.png",
      "pathway": "AI Specialist Path",
      "isApproved": true,
      "createdAt": "2026-03-10T14:00:00.000Z"
    },
    {
      "id": "c_react",
      "title": "Advanced Web Frameworks: React & Redux",
      "description": "Build high-performance, single-page web applications. Learn state management, components lifecycle, virtual DOM, and client-side routing.",
      "instructorId": "u_instructor",
      "instructorName": "Dr. Sarah Connor",
      "category": "Web Development",
      "level": "Advanced",
      "language": "fr",
      "price": 79.99,
      "rating": 4.5,
      "thumbnail": "assets/course_react.png",
      "pathway": "Web Developer Path",
      "isApproved": false,
      "createdAt": "2026-04-01T12:00:00.000Z"
    }
  ],
  lessons: [
    {
      "id": "l_html_1",
      "courseId": "c_html",
      "title": "Welcome to Web Structure & HTML Fundamentals",
      "description": "Understand what HTML is, the role of browsers, how requests work, and creating your very first .html document.",
      "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "pdfUrl": "assets/html_intro_cheatsheet.pdf",
      "duration": 10,
      "order": 1
    },
    {
      "id": "l_html_2",
      "courseId": "c_html",
      "title": "Working with Semantic Tags & Content Blocks",
      "description": "Dive deep into header, nav, main, article, section, footer tags, and understand why page semantic structure matters for SEO and accessibility.",
      "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "pdfUrl": "assets/html_semantics_guide.pdf",
      "duration": 15,
      "order": 2
    },
    {
      "id": "l_css_1",
      "courseId": "c_css",
      "title": "CSS selectors, Specificity, and the Box Model",
      "description": "Get to grips with selectors, margins, paddings, borders, outlines, block-level vs inline layout modes, and design specificity.",
      "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "pdfUrl": "assets/css_boxmodel_reference.pdf",
      "duration": 12,
      "order": 1
    },
    {
      "id": "l_css_2",
      "courseId": "c_css",
      "title": "Creating Glassmorphic Cards & Grid Layouts",
      "description": "Learn to write advanced visual rules. Create dynamic grids, handle responsiveness, implement backdrop blur effects, and add subtle animations.",
      "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      "pdfUrl": "assets/css_glassmorphic_grid.pdf",
      "duration": 18,
      "order": 2
    },
    {
      "id": "l_js_1",
      "courseId": "c_js",
      "title": "Variables, Scope, and Data Structures in JS",
      "description": "Introduction to let, const, block scope, arrays, objects, maps, loops, and basic logic controls.",
      "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      "pdfUrl": "assets/js_variables_cheatsheet.pdf",
      "duration": 15,
      "order": 1
    },
    {
      "id": "l_js_2",
      "courseId": "c_js",
      "title": "DOM Interactions & Persistent LocalStorage",
      "description": "Learn how JavaScript binds with the UI. Query selectors, event listeners, updating DOM state, and storing user preferences in the browser database.",
      "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      "pdfUrl": "assets/js_localstorage_guide.pdf",
      "duration": 22,
      "order": 2
    },
    {
      "id": "l_ai_1",
      "courseId": "c_ai_basics",
      "title": "Neural Networks, LLMs and Prompt Engineering Essentials",
      "description": "Introduction to AI history, artificial neural networks, transformers, and the syntax of writing effective prompts (role, context, constraints).",
      "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
      "pdfUrl": "assets/ai_prompt_engineering_blueprint.pdf",
      "duration": 14,
      "order": 1
    }
  ],
  quizzes: [
    {
      "id": "q_html",
      "courseId": "c_html",
      "title": "HTML5 & Web Structure Mastery Quiz",
      "duration": 5,
      "questions": [
        {
          "id": "q_html_1",
          "question": "Which HTML5 element represents the main content of the document body?",
          "options": ["<content>", "<section>", "<main>", "<article>"],
          "answerIndex": 2,
          "points": 10
        },
        {
          "id": "q_html_2",
          "question": "What is the correct tag for creating an anchor link?",
          "options": ["<link>", "<a>", "<href>", "<anchor>"],
          "answerIndex": 1,
          "points": 10
        },
        {
          "id": "q_html_3",
          "question": "Which attribute specifies an alternate text for an image if the image cannot be displayed?",
          "options": ["title", "src", "alt", "desc"],
          "answerIndex": 2,
          "points": 10
        }
      ]
    },
    {
      "id": "q_css",
      "courseId": "c_css",
      "title": "CSS3 Styling & Grid Layouts Quiz",
      "duration": 7,
      "questions": [
        {
          "id": "q_css_1",
          "question": "In the CSS Box Model, which property sits directly between padding and margin?",
          "options": ["outline", "border", "content", "background"],
          "answerIndex": 1,
          "points": 10
        },
        {
          "id": "q_css_2",
          "question": "Which value of backdrop-filter is used to create a glassmorphism blur?",
          "options": ["blur()", "transparent()", "opacity()", "saturate()"],
          "answerIndex": 0,
          "points": 10
        },
        {
          "id": "q_css_3",
          "question": "Which selector has the highest specificity?",
          "options": ["Class selector (.nav)", "ID selector (#header)", "Element selector (div)", "Inline style attribute"],
          "answerIndex": 3,
          "points": 10
        }
      ]
    },
    {
      "id": "q_js",
      "courseId": "c_js",
      "title": "Modern JavaScript Fundamentals Quiz",
      "duration": 10,
      "questions": [
        {
          "id": "q_js_1",
          "question": "Which keyword defines a block-scoped variable that cannot be reassigned?",
          "options": ["var", "let", "const", "static"],
          "answerIndex": 2,
          "points": 10
        },
        {
          "id": "q_js_2",
          "question": "How do you store an object in LocalStorage as a string?",
          "options": [
            "JSON.stringify(object)",
            "JSON.parse(object)",
            "object.toString()",
            "LocalStorage.set(object)"
          ],
          "answerIndex": 0,
          "points": 10
        },
        {
          "id": "q_js_3",
          "question": "Which array method returns a new array with all elements that pass a test?",
          "options": ["map()", "forEach()", "filter()", "reduce()"],
          "answerIndex": 2,
          "points": 10
        }
      ]
    },
    {
      "id": "q_ai_basics",
      "courseId": "c_ai_basics",
      "title": "AI & Prompt Engineering Basics Quiz",
      "duration": 5,
      "questions": [
        {
          "id": "q_ai_1",
          "question": "What is the primary role of 'Prompt Engineering'?",
          "options": [
            "Writing code to train neural network architectures",
            "Crafting inputs to guide LLMs toward accurate outputs",
            "Designing user interfaces for AI chat applications",
            "Calculating graphics acceleration workloads"
          ],
          "answerIndex": 1,
          "points": 10
        },
        {
          "id": "q_ai_2",
          "question": "What does LLM stand for?",
          "options": [
            "Linear Learning Machine",
            "Link Layer Manager",
            "Large Language Model",
            "Logic Learning Module"
          ],
          "answerIndex": 2,
          "points": 10
        }
      ]
    }
  ],
  progress: [
    {
      "id": "progress_u_student_c_html",
      "userId": "u_student",
      "courseId": "c_html",
      "completedLessons": ["l_html_1"],
      "completedQuizzes": [],
      "bookmarks": [
        {
          "lessonId": "l_html_1",
          "timestamp": 125,
          "noteText": "Bookmark here for introduction to anchor tags."
        }
      ],
      "notes": [
        {
          "lessonId": "l_html_1",
          "text": "HTML5 introduces tags like <main>, <article>, and <section> to structure pages cleanly.",
          "date": "2026-06-25T14:20:00.000Z"
        }
      ],
      "pointsEarned": 20,
      "completed": false,
      "completedAt": null
    }
  ],
  payments: [
    {
      "id": "pay_1",
      "userId": "u_student",
      "courseId": "c_html",
      "amount": 19.99,
      "couponCode": "WELCOME20",
      "date": "2026-06-25T10:15:30.000Z"
    }
  ],
  certificates: [
    {
      "id": "CERT-87621-HTML",
      "userId": "u_student",
      "userName": "Alex Mercer",
      "courseId": "c_html",
      "courseTitle": "Introduction to HTML5 & Web Structure",
      "date": "2026-06-26T17:45:00.000Z",
      "verifyHash": "a1b2c3d4e5f6g7h8"
    }
  ],
  reviews: [
    {
      "id": "rev_1",
      "courseId": "c_html",
      "userId": "u_student",
      "userName": "Alex Mercer",
      "rating": 5,
      "comment": "Perfect course for absolute beginners! The explanations of semantic layout tags are crystal clear.",
      "date": "2026-06-25T15:30:00.000Z"
    },
    {
      "id": "rev_2",
      "courseId": "c_html",
      "userId": "u_student_2",
      "userName": "Jane Doe",
      "rating": 4,
      "comment": "Very good, well-paced structure. Looking forward to the CSS sequel!",
      "date": "2026-06-20T11:00:00.000Z"
    },
    {
      "id": "rev_3",
      "courseId": "c_css",
      "userId": "u_student_2",
      "userName": "Jane Doe",
      "rating": 5,
      "comment": "Loved the glassmorphism section. The responsive layouts tutorial is the best I've seen.",
      "date": "2026-06-22T09:15:00.000Z"
    }
  ],
  announcements: [
    {
      "id": "ann_1",
      "courseId": "c_html",
      "title": "HTML5 Canvas Cheat Sheet Added!",
      "content": "Hi everyone! I have uploaded a bonus HTML5 Canvas reference guide in the course materials. Make sure to check it out in Lesson 2 resources.",
      "date": "2026-06-26T08:00:00.000Z"
    },
    {
      "id": "ann_2",
      "courseId": "c_css",
      "title": "Welcome to CSS3 Styling!",
      "content": "Welcome to the class. Please make sure to download the box-model cheatsheet before watching the first video, it will make layouts much easier to comprehend.",
      "date": "2026-06-25T09:00:00.000Z"
    }
  ]
};

// 2. Database Controllers (LocalStorage Wrapper)
const DB = {
  prefix: "edusphere_",

  get(table) {
    const raw = localStorage.getItem(this.prefix + table);
    return raw ? JSON.parse(raw) : [];
  },

  set(table, data) {
    localStorage.setItem(this.prefix + table, JSON.stringify(data));
  },

  insert(table, record) {
    const data = this.get(table);
    data.push(record);
    this.set(table, data);
    return record;
  },

  update(table, id, updatedFields) {
    const data = this.get(table);
    const index = data.findIndex(r => r.id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updatedFields };
      this.set(table, data);
      return data[index];
    }
    return null;
  },

  delete(table, id) {
    const data = this.get(table);
    const filtered = data.filter(r => r.id !== id);
    this.set(table, filtered);
  },

  async seed() {
    // Check if seeded already
    if (localStorage.getItem(this.prefix + "seeded")) return;

    for (const [table, fallback] of Object.entries(FALLBACK_DATA)) {
      try {
        const response = await fetch(`data/${table}.json`);
        if (response.ok) {
          const fetchedData = await response.json();
          this.set(table, fetchedData);
        } else {
          this.set(table, fallback);
        }
      } catch (err) {
        // Fallback for CORS file:// blocks
        this.set(table, fallback);
      }
    }
    localStorage.setItem(this.prefix + "seeded", "true");
  }
};

// 3. User Session Utilities
const Session = {
  getCurrentUser() {
    const impersonated = localStorage.getItem("edusphere_impersonated_user");
    if (impersonated) {
      return JSON.parse(impersonated);
    }
    const user = localStorage.getItem("edusphere_current_user");
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem("edusphere_current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("edusphere_current_user");
      localStorage.removeItem("edusphere_impersonated_user");
    }
  },

  isImpersonating() {
    return !!localStorage.getItem("edusphere_impersonated_user");
  },

  stopImpersonating() {
    localStorage.removeItem("edusphere_impersonated_user");
    window.location.reload();
  },

  logout() {
    this.setCurrentUser(null);
    window.location.href = "login.html";
  }
};

// 4. Multi-language Dictionary
const TRANSLATIONS = {
  en: {
    "nav_home": "Home",
    "nav_courses": "Courses",
    "nav_dashboard": "Dashboard",
    "nav_profile": "Profile",
    "nav_login": "Login",
    "nav_register": "Register",
    "nav_logout": "Logout",
    "welcome_message": "Unlock Your Coding Potential",
    "hero_desc": "LDS E-Learning Platform provides state-of-the-art interactive modules, timed assessments, and AI tutoring to supercharge your tech capabilities.",
    "cta_explore": "Explore Courses",
    "cta_join": "Join Platform",
    "leaderboard": "Top Learners Leaderboard",
    "points": "Points",
    "accessibility_settings": "Accessibility Controls",
    "dark_mode": "Dark Mode",
    "high_contrast": "High Contrast",
    "save_preferences": "Save Profile & Preferences"
  },
  fr: {
    "nav_home": "Accueil",
    "nav_courses": "Cours",
    "nav_dashboard": "Tableau de Bord",
    "nav_profile": "Profil",
    "nav_login": "Connexion",
    "nav_register": "S'inscrire",
    "nav_logout": "Déconnexion",
    "welcome_message": "Débloquez Votre Potentiel de Code",
    "hero_desc": "La plateforme LDS E-Learning fournit des modules interactifs de pointe, des évaluations chronométrées et un tutorat par IA pour propulser vos capacités techniques.",
    "cta_explore": "Explorer les cours",
    "cta_join": "Rejoindre la plateforme",
    "leaderboard": "Classement des Meilleurs Apprenants",
    "points": "Points",
    "accessibility_settings": "Contrôles d'Accessibilité",
    "dark_mode": "Mode Sombre",
    "high_contrast": "Contraste Élevé",
    "save_preferences": "Enregistrer le profil et les préférences"
  },
  rw: {
    "nav_home": "Ahabanza",
    "nav_courses": "Amasomo",
    "nav_dashboard": "Ibiro",
    "nav_profile": "Umwirondoro",
    "nav_login": "Kwinjira",
    "nav_register": "Kwandika",
    "nav_logout": "Gusohoka",
    "welcome_message": "Fungura Ubushobozi Bwawe Bwo Gukoda",
    "hero_desc": "LDS E-Learning Platform itanga porogaramu zigezweho zo kwiga, ibizamini bipimye igihe, no gufashwa na AI kugira ngo uzamure ubumenyi bwawe mu buhanga.",
    "cta_explore": "Shaka Amasomo",
    "cta_join": "Yandikishe Hano",
    "leaderboard": "Abanyeshuri B’Indashyikirwa",
    "points": "Amanota",
    "accessibility_settings": "Uburyo Bwo Kugerwaho",
    "dark_mode": "Uburyo Bwirabura",
    "high_contrast": "Uburyo Bugaragara Cyane",
    "save_preferences": "Bika Ibyatoranyijwe"
  }
};

function translateUI() {
  const user = Session.getCurrentUser();
  const lang = user?.preferences?.language || localStorage.getItem("edusphere_lang") || "en";
  
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      if (el.tagName === "INPUT" && (el.type === "submit" || el.type === "button")) {
        el.value = TRANSLATIONS[lang][key];
      } else {
        el.textContent = TRANSLATIONS[lang][key];
      }
    }
  });
}

// 5. Global Layout Builders & Theme Loader
function loadThemeAndContrast() {
  const user = Session.getCurrentUser();
  const theme = user?.preferences?.theme || localStorage.getItem("edusphere_theme") || "dark";
  const contrast = user?.preferences?.contrast || localStorage.getItem("edusphere_contrast") || "normal";
  
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-contrast", contrast);
}

function injectNavbar() {
  const header = document.querySelector("header.global-header");
  if (!header) return;

  const currentUser = Session.getCurrentUser();
  const points = currentUser?.points || 0;
  
  // Impersonating warning if active
  let impersonatingBanner = "";
  if (Session.isImpersonating()) {
    impersonatingBanner = `
      <div class="impersonating-banner">
        <span>You are currently impersonating <strong>${currentUser.name}</strong> (${currentUser.role})</span>
        <button class="btn btn-xs btn-primary" onclick="Session.stopImpersonating()">Exit Impersonation</button>
      </div>
    `;
  }

  let navLinks = `
    <li><a href="index.html" class="nav-link" data-i18n="nav_home">Home</a></li>
    <li><a href="courses.html" class="nav-link" data-i18n="nav_courses">Courses</a></li>
  `;

  let navActions = "";

  if (currentUser) {
    navLinks += `
      <li><a href="dashboard.html" class="nav-link" data-i18n="nav_dashboard">Dashboard</a></li>
      <li><a href="profile.html" class="nav-link" data-i18n="nav_profile">Profile</a></li>
    `;

    navActions = `
      <div class="points-pill">
        <span>🏆</span> <span id="nav-points-val">${points}</span> <span data-i18n="points">Points</span>
      </div>
      <div class="nav-user" onclick="window.location.href='profile.html'">
        <div class="nav-avatar">${currentUser.name.split(' ').map(n=>n[0]).join('')}</div>
      </div>
      <button class="btn btn-secondary btn-xs" onclick="Session.logout()" data-i18n="nav_logout">Logout</button>
    `;
  } else {
    navActions = `
      <a href="login.html" class="btn btn-secondary btn-xs" data-i18n="nav_login">Login</a>
      <a href="register.html" class="btn btn-primary btn-xs" data-i18n="nav_register">Register</a>
    `;
  }

  header.innerHTML = `
    ${impersonatingBanner}
    <nav class="navbar">
      <a href="index.html" class="nav-brand">
        <img src="images/logo.png" alt="LDS E-Learning Logo" class="nav-logo-img"> LDS E-Learning
      </a>
      <ul class="nav-menu">
        ${navLinks}
      </ul>
      <div class="nav-actions">
        ${navActions}
      </div>
    </nav>
  `;

  // Highlighting active page link
  const currentFilename = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === currentFilename) {
      link.classList.add("active");
    }
  });

  translateUI();
}

function injectFooter() {
  const footer = document.querySelector("footer.global-footer");
  if (!footer) return;

  footer.innerHTML = `
    <div class="container" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 2rem; font-size: 0.9rem; color: var(--text-muted);">
      <div>© 2026 LDS E-Learning Platforms. All rights simulated.</div>
      <div style="display: flex; gap: 1rem;">
        <span style="cursor: pointer" onclick="setLanguage('en')">English</span>
        <span style="cursor: pointer" onclick="setLanguage('fr')">Français</span>
        <span style="cursor: pointer" onclick="setLanguage('rw')">Kinyarwanda</span>
      </div>
    </div>
  `;
}

function setLanguage(lang) {
  const user = Session.getCurrentUser();
  if (user) {
    user.preferences.language = lang;
    DB.update("users", user.id, { preferences: user.preferences });
    Session.setCurrentUser(user);
  } else {
    localStorage.setItem("edusphere_lang", lang);
  }
  translateUI();
  showToast(`Language changed to ${lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'Kinyarwanda'}`, "success");
}

// 6. Interactive Toast Library
const Toasts = {
  container: null,

  init() {
    this.container = document.createElement("div");
    this.container.className = "toast-container";
    document.body.appendChild(this.container);
  },

  show(message, type = "info") {
    if (!this.container) this.init();

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = "ℹ️";
    if (type === "success") icon = "✅";
    if (type === "warning") icon = "⚠️";
    if (type === "danger") icon = "🚨";

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};

function showToast(msg, type) {
  Toasts.show(msg, type);
}

// 7. AI Assistant — EduBot (Intelligent Knowledge Engine)
const AI = (() => {

  // ── Knowledge Base ───────────────────────────────────────────────────────
  const KB = [
    {
      id: 'greeting',
      tags: ['hello','hi','hey','good morning','good afternoon','good evening','howdy','greetings','hiya','start'],
      response: () =>
        `Hello there! 👋 I'm **EduBot**, your LDS E-Learning assistant!\n\nI can help you with:\n• 📚 Finding & exploring courses\n• 🔐 Registration & login\n• ⏱️ Quizzes & assessments\n• 🏆 Badges & gamification\n• 🧭 Navigating the platform\n\nWhat would you like to know?`
    },
    {
      id: 'about',
      tags: ['what is','about','tell me','platform','lds','overview','explain','describe','purpose'],
      response: () => {
        const n = (window.DB && window.DB.get('courses') || []).filter(c => c.isApproved).length;
        return `**LDS E-Learning Platform** is an advanced interactive tech-education hub! 🎓\n\n🌐 **What we offer:**\n• ${n}+ approved courses — Web Dev, AI & Robotics\n• Interactive video-style lesson player\n• Timed quizzes with instant grading\n• Collectible digital badges & global leaderboard\n• Multi-language support (EN / FR / Kinyarwanda)\n• Dark/Light/High-Contrast themes\n\nOur mission: take you from **absolute beginner** to **job-ready developer**! 🚀`;
      }
    },
    {
      id: 'courses',
      tags: ['course','courses','class','classes','learn','learning','subject','topic','study','catalog','available','browse','enroll','enrollment','pathway','path'],
      response: () => {
        const list = (window.DB && window.DB.get('courses') || []).filter(c => c.isApproved);
        if (!list.length) return `We have courses in **Web Development**, **AI**, and **Robotics**!\n\nVisit **[Courses](courses.html)** to browse them!`;
        const preview = list.slice(0, 4).map(c => `• **${c.title}**\n  ${c.level} | $${c.price} | ⭐ ${c.rating}`).join('\n');
        return `We have **${list.length} approved courses**! Here is a snapshot:\n\n${preview}\n\n👉 Visit **[Courses](courses.html)** to see all options!`;
      }
    },
    {
      id: 'register',
      tags: ['register','sign up','signup','create account','join','new account','get started','new user','how to join','how to register'],
      response: () =>
        `Creating an account is quick and free! 🎉\n\n**Steps to register:**\n1. Click **Register** in the top navigation\n2. Enter your full name and email\n3. Choose a password (6+ characters)\n4. Pick your role: **Student** or **Instructor**\n5. Submit — you're in!\n\n✅ Once approved you unlock courses, your dashboard, and progress tracking.\n\n👉 **[Register Now](register.html)**`
    },
    {
      id: 'login',
      tags: ['login','log in','sign in','signin','access my account','how to login','how do i login','credentials'],
      response: () =>
        `Signing in is easy! 🔐\n\n1. Click **Login** in the top navigation\n2. Enter your **email** and **password**\n3. Click **Sign In**\n\n💡 **Demo Credentials:**\n• Student → student@edusphere.com\n• Instructor → instructor@edusphere.com\n• Admin → admin@edusphere.com\n*(All passwords: password123)*\n\n👉 **[Login Now](login.html)**`
    },
    {
      id: 'password',
      tags: ['password','forgot','reset','lost password','change password','wrong password'],
      response: () =>
        `🔑 **Demo Account Passwords** are all **password123**\n\n• student@edusphere.com / password123\n• instructor@edusphere.com / password123\n• admin@edusphere.com / password123\n\nTo change your password after login, go to **Profile → Account Settings**.`
    },
    {
      id: 'quiz',
      tags: ['quiz','quizzes','test','assessment','exam','timed','graded','score','mark','grade','evaluation','question','questions'],
      response: () =>
        `Our **Timed Assessment System** verifies your knowledge! ⏱️\n\n**How quizzes work:**\n• Each course has a timed quiz\n• Usually 5–10 minute time limit\n• Multiple-choice, instantly graded\n• Earn **points** for each correct answer\n• Pass the quiz to unlock your **course badge** 🏅\n\nYour scores appear in your **Dashboard** for tracking.`
    },
    {
      id: 'badge',
      tags: ['badge','badges','achievement','achievements','reward','rewards','earn','collect','trophy','gamification','points','rank','ranking','leaderboard','level up'],
      response: () => {
        const users = (window.DB && window.DB.get('users') || []).sort((a,b) => (b.points||0) - (a.points||0)).slice(0,3);
        const board = users.length
          ? users.map((u,i) => `${['🥇','🥈','🥉'][i]} **${u.name}** — ${u.points||0} pts`).join('\n')
          : '🥇 Be the first to earn points!';
        return `Our **Gamification System** makes learning addictive! 🏆\n\n**Earn badges by:**\n• Completing your first course → 🌟 Beginner Learner\n• Scoring 200+ points → 🎓 Quiz Master\n• Scoring 400+ points → 🏆 Course Champion\n\n**Current Top 3:**\n${board}\n\nClimb the leaderboard — the more you learn, the higher you rank!`;
      }
    },
    {
      id: 'certificate',
      tags: ['certificate','certification','diploma','credential','completion','graduate','proof','download cert'],
      response: () =>
        `Yes! We issue personalised **completion certificates**! 🎓\n\n**How to earn one:**\n1. Enroll in a course\n2. Watch all lessons\n3. Pass the final quiz\n4. Download your PDF certificate\n\nCertificates show your name, course title, date, and instructor — perfect for LinkedIn and portfolios!`
    },
    {
      id: 'dashboard',
      tags: ['dashboard','my account','my courses','progress','tracking','enrolled','my progress','portal','console','where is'],
      response: () =>
        `Your **Dashboard** is your learning command centre! 🎛️\n\n**What you can do:**\n• 📊 Track enrolled courses and lesson progress\n• ✅ Resume where you left off\n• 🏆 View points, badges and quiz scores\n• 📜 Download certificates\n• *(Instructors)* Create and manage courses\n• *(Admins)* Approve courses and manage users\n\n👉 **[Open Dashboard](dashboard.html)**`
    },
    {
      id: 'profile',
      tags: ['profile','settings','account settings','preferences','update','edit profile','my profile','bio','avatar','picture','photo'],
      response: () =>
        `Your **Profile page** is where you personalise everything! 👤\n\n**You can update:**\n• Full name and bio\n• Profile avatar / photo\n• Language (English / French / Kinyarwanda)\n• Theme (Dark / Light / High Contrast)\n\nAll preferences are saved and applied across the platform.\n\n👉 **[Go to Profile](profile.html)**`
    },
    {
      id: 'language',
      tags: ['language','french','kinyarwanda','english','translate','translation','multilingual','locale','switch language'],
      response: () =>
        `We support **3 languages** across the entire platform! 🌍\n\n• 🇬🇧 English *(default)*\n• 🇫🇷 French — Français\n• 🇷🇼 Kinyarwanda — Ikinyarwanda\n\n**To switch:** Visit **Profile** and select your preferred language, or use the switcher at the **bottom of any page**.`
    },
    {
      id: 'theme',
      tags: ['dark mode','light mode','theme','contrast','accessibility','high contrast','appearance','color scheme'],
      response: () =>
        `Full theme customisation is built-in! 🎨\n\n• 🌙 **Dark Mode** *(default)* — easy on the eyes\n• ☀️ **Light Mode** — clean and bright\n• ⚫ **High Contrast** — maximum accessibility\n\n**How to change:** Go to **Profile → Accessibility Controls**. Your choice is saved automatically!`
    },
    {
      id: 'instructor',
      tags: ['instructor','teacher','create course','add course','upload','content creator','teach','teaching','publish course'],
      response: () =>
        `Instructors can create and publish their own courses! 👩‍🏫\n\n**Instructor powers:**\n• Build full courses with multiple lessons\n• Add timed quizzes and learning objectives\n• Set price, level, and category\n• Submit for admin approval\n• View student reviews and enrollments\n\n**Getting started:** Register as **Instructor** → Login → Dashboard → *Create New Course*`
    },
    {
      id: 'price',
      tags: ['price','cost','free','paid','fee','subscription','payment','how much','affordable','purchase','buy','pricing'],
      response: () => {
        const prices = (window.DB && window.DB.get('courses') || []).filter(c => c.isApproved).map(c => c.price).filter(Boolean);
        const lo = prices.length ? Math.min(...prices).toFixed(2) : '19.99';
        const hi = prices.length ? Math.max(...prices).toFixed(2) : '79.99';
        return `Course pricing varies by topic! 💰\n\n**Price range:** $${lo} – $${hi}\n\nEvery course includes:\n• Full lesson access (lifetime)\n• Timed quiz and instant grading\n• Course badge and certificate\n• No recurring subscription\n\n👉 Visit **[Courses](courses.html)** to compare prices!`;
      }
    },
    {
      id: 'html',
      tags: ['html','html5','markup','tag','tags','hypertext','web structure','semantic'],
      response: () =>
        `**HTML5** is the foundation of every website! 🌐\n\nKey concepts in our HTML course:\n• Semantic tags: \`<main>\`, \`<article>\`, \`<section>\`, \`<nav>\`\n• Links, images, tables, forms\n• Accessible \`alt\` attributes\n• Headings hierarchy (h1–h6)\n\n👉 Browse **[Courses](courses.html)** to enroll!`
    },
    {
      id: 'css',
      tags: ['css','css3','style','styling','glassmorphism','responsive','flexbox','grid','media query','animation'],
      response: () =>
        `**CSS3** brings your HTML to life! 🎨\n\nTopics in our CSS course:\n• Flexbox and CSS Grid layouts\n• Responsive design with media queries\n• Glassmorphism (backdrop-filter, blur)\n• CSS Variables and custom properties\n• Keyframe animations and transitions\n\n👉 See **[Courses](courses.html)** to enroll!`
    },
    {
      id: 'javascript',
      tags: ['javascript','js','es6','dom','localstorage','programming','function','array','async','api','fetch'],
      response: () =>
        `**Modern JavaScript** powers interactive web apps! ⚡\n\nTopics in our JS course:\n• Variables, arrays, objects, functions\n• DOM manipulation and event listeners\n• Async/Await and Promises (fetch API)\n• ES6+ syntax (arrow functions, destructuring)\n• LocalStorage for data persistence\n\n👉 See **[Courses](courses.html)** to enroll!`
    },
    {
      id: 'ai_course',
      tags: ['ai','artificial intelligence','machine learning','prompt','prompt engineering','robotics'],
      response: () =>
        `We offer an **AI and Prompt Engineering** course! 🤖\n\nYou will learn:\n• What AI is and how LLMs work\n• Writing effective prompts\n• Using AI tools for productivity\n• Ethical AI considerations\n\n👉 Browse it on the **[Courses page](courses.html)**!`
    },
    {
      id: 'help',
      tags: ['help','support','problem','issue','error','trouble','stuck','assist','not working','broken','bug','faq','cannot'],
      response: () =>
        `I am here to help! 🤝 Common fixes:\n\n• 🔐 **Cannot login?** Use: student@edusphere.com / password123\n• 📚 **Courses not showing?** Refresh the page\n• 💾 **Progress not saving?** Enable browser local storage\n• 🌙 **Theme resetting?** Save preferences in Profile\n\nOr just ask me a specific question!`
    },
    {
      id: 'farewell',
      tags: ['bye','goodbye','see you','later','thanks','thank you','done','exit','close','ciao'],
      response: () =>
        `You are welcome! 😊 Happy learning!\n\n🚀 Quick links:\n• **[Browse Courses](courses.html)**\n• **[My Dashboard](dashboard.html)**\n• **[My Profile](profile.html)**\n\nFeel free to ask me anything anytime. **Good luck on your journey!** 🎓`
    }
  ];

  const FALLBACKS = [
    `Hmm, I did not quite catch that. 🤔 Try asking:\n• *"What courses are available?"*\n• *"How do I register?"*\n• *"How do badges work?"*`,
    `I am not sure about that specific topic, but I can help with courses, quizzes, badges, registration, login, certificates, and platform navigation! What else can I help with?`,
    `I am still expanding my knowledge. 🤖 Try typing:\n• **courses** — available courses\n• **quiz** — about assessments\n• **badges** — gamification info\n• **help** — common fixes`
  ];
  let fbIdx = 0;

  function getResponse(userMsg) {
    const msg = userMsg.toLowerCase().trim();
    let best = { score: 0, entry: null };
    KB.forEach(entry => {
      const score = entry.tags.reduce((acc, tag) => acc + (msg.includes(tag) ? tag.split(' ').length : 0), 0);
      if (score > best.score) best = { score, entry };
    });
    if (best.score > 0) return best.entry.response();
    return FALLBACKS[fbIdx++ % FALLBACKS.length];
  }

  function fmt(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1);padding:1px 5px;border-radius:4px;font-family:monospace;font-size:0.85em">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:var(--color-secondary);font-weight:600;text-decoration:underline">$1</a>')
      .replace(/\n/g, '<br>');
  }

  function addMsg(text, isUser) {
    const wrap = document.getElementById('ai-chat-messages');
    if (!wrap) return;
    const div = document.createElement('div');
    div.className = `ai-chat-msg ${isUser ? 'user' : 'bot'}`;
    div.innerHTML = isUser
      ? `<div class="ai-bubble-user">${text}</div>`
      : `<div class="ai-bot-row"><div class="ai-bot-avatar">🤖</div><div class="ai-bubble-bot">${fmt(text)}</div></div>`;
    wrap.appendChild(div);
    wrap.scrollTop = wrap.scrollHeight;
  }

  function showTyping() {
    const wrap = document.getElementById('ai-chat-messages');
    if (!wrap) return;
    const div = document.createElement('div');
    div.id = 'ai-typing-indicator';
    div.className = 'ai-chat-msg bot';
    div.innerHTML = `<div class="ai-bot-row"><div class="ai-bot-avatar">🤖</div><div class="ai-bubble-bot ai-typing"><span></span><span></span><span></span></div></div>`;
    wrap.appendChild(div);
    wrap.scrollTop = wrap.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('ai-typing-indicator');
    if (t) t.remove();
  }

  function sendMessage() {
    const input = document.getElementById('ai-chat-input');
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    input.value = '';
    addMsg(text, true);
    showTyping();
    setTimeout(() => { removeTyping(); addMsg(getResponse(text), false); }, 700 + Math.random() * 500);
  }

  function handleKeyPress(e) { if (e.key === 'Enter') sendMessage(); }

  function toggleChat() {
    const win = document.getElementById('ai-chat-window');
    const btn = document.getElementById('ai-widget-btn');
    const badge = document.getElementById('ai-notif-badge');
    if (!win) return;
    const isOpen = win.classList.toggle('open');
    if (btn) btn.classList.toggle('active', isOpen);
    if (badge) badge.style.display = 'none';
  }

  function injectWidget() {
    if (document.getElementById('ai-widget-container')) return;
    const div = document.createElement('div');
    div.id = 'ai-widget-container';
    div.innerHTML = `
      <div class="ai-chat-window" id="ai-chat-window">
        <div class="ai-chat-header">
          <div class="ai-header-left">
            <div class="ai-header-avatar">🤖</div>
            <div>
              <div class="ai-header-name">EduBot</div>
              <div class="ai-header-status"><span class="ai-status-dot"></span> Online — LDS AI Assistant</div>
            </div>
          </div>
          <button class="ai-close-btn" onclick="AI.toggleChat()" title="Close">✕</button>
        </div>
        <div class="ai-chat-messages" id="ai-chat-messages"></div>
        <div class="ai-chat-footer">
          <input type="text" class="ai-chat-input" id="ai-chat-input"
            placeholder="Ask me anything…" autocomplete="off"
            onkeypress="AI.handleKeyPress(event)">
          <button class="ai-send-btn" onclick="AI.sendMessage()" title="Send">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
      <button class="ai-widget-btn" id="ai-widget-btn" onclick="AI.toggleChat()" title="Chat with EduBot">
        <span class="ai-btn-icon-open">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </span>
        <span class="ai-btn-icon-close">✕</span>
        <span class="ai-notif-badge" id="ai-notif-badge">1</span>
      </button>
    `;
    document.body.appendChild(div);
    document.getElementById('ai-chat-input').addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
    setTimeout(() => {
      addMsg('👋 Hi! I\'m **EduBot**, your LDS E-Learning assistant!\n\nAsk me anything about courses, quizzes, badges, registration, and more — I\'m here to help! 😊', false);
    }, 1200);
  }

  return { injectWidget, toggleChat, sendMessage, handleKeyPress };

})();




// 8. Reward / Point Engine
function awardPoints(amount, reason) {
  const user = Session.getCurrentUser();
  if (!user) return;
  user.points = (user.points || 0) + amount;
  
  // Award badges based on points milestones
  if (user.points >= 200 && !user.badges.includes("Quiz Master")) {
    user.badges.push("Quiz Master");
    showToast("🏆 Badge Unlocked: Quiz Master!", "success");
  }
  if (user.points >= 400 && !user.badges.includes("Course Champion")) {
    user.badges.push("Course Champion");
    showToast("🏆 Badge Unlocked: Course Champion!", "success");
  }

  DB.update("users", user.id, { points: user.points, badges: user.badges });
  Session.setCurrentUser(user);

  // Update navbar UI points if rendering
  const navPoints = document.getElementById("nav-points-val");
  if (navPoints) navPoints.textContent = user.points;
  
  showToast(`Earned +${amount} points for: ${reason}`, "success");
}

// 9. Initial Load Orchestrator
document.addEventListener("DOMContentLoaded", async () => {
  await DB.seed();
  loadThemeAndContrast();
  injectNavbar();
  injectFooter();
  AI.injectWidget();
});

// Bind to window to allow simple inline scripts calling functions
window.DB = DB;
window.Session = Session;
window.showToast = showToast;
window.awardPoints = awardPoints;
window.setLanguage = setLanguage;
window.AI = AI;
