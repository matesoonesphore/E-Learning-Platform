// --- LDS COURSE MARKETPLACE & E-COMMERCE ENGINE ---

const Courses = {
  // Coupon codes database
  coupons: {
    "WELCOME20": 0.20,
    "AILEARN50": 0.50
  },

  // 1. Marketplace Initializer (courses.html)
  initMarketplace() {
    this.renderFilters();
    this.filterCourses();
    this.renderLearningPaths();
  },

  renderFilters() {
    const courses = window.DB.get("courses").filter(c => c.isApproved);
    const categories = ["All", ...new Set(courses.map(c => c.category))];
    
    const catSelect = document.getElementById("filter-category");
    if (catSelect) {
      catSelect.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    }
  },

  filterCourses() {
    const searchVal = (document.getElementById("search-input")?.value || "").toLowerCase();
    const categoryVal = document.getElementById("filter-category")?.value || "All";
    const levelVal = document.getElementById("filter-level")?.value || "All";
    const langVal = document.getElementById("filter-language")?.value || "All";
    const priceVal = document.getElementById("filter-price")?.value || "All";

    let courses = window.DB.get("courses").filter(c => c.isApproved);

    // Apply Search
    if (searchVal) {
      courses = courses.filter(c => 
        c.title.toLowerCase().includes(searchVal) || 
        c.description.toLowerCase().includes(searchVal)
      );
    }

    // Apply Category
    if (categoryVal !== "All") {
      courses = courses.filter(c => c.category === categoryVal);
    }

    // Apply Level
    if (levelVal !== "All") {
      courses = courses.filter(c => c.level === levelVal);
    }

    // Apply Language
    if (langVal !== "All") {
      courses = courses.filter(c => c.language === langVal);
    }

    // Apply Price
    if (priceVal !== "All") {
      if (priceVal === "free") {
        courses = courses.filter(c => c.price === 0);
      } else {
        courses = courses.filter(c => c.price > 0);
      }
    }

    this.renderCourseGrid(courses);
  },

  renderCourseGrid(courses) {
    const grid = document.getElementById("courses-grid");
    if (!grid) return;

    if (courses.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">
        <h3>No courses match your active search filters.</h3>
      </div>`;
      return;
    }

    grid.innerHTML = courses.map(course => {
      // SVG Thumbnail generator based on course category
      const svgThumb = this.getSvgThumbnail(course.category);
      const user = window.Session.getCurrentUser();
      const progress = window.DB.get("progress").find(p => p.userId === user?.id && p.courseId === course.id);
      const isEnrolled = !!progress;

      let btnLabel = isEnrolled ? "Go to Class" : `Enroll - $${course.price}`;
      if (course.price === 0 && !isEnrolled) btnLabel = "Enroll Free";

      return `
        <article class="card course-card">
          <div class="course-thumb">
            ${svgThumb}
            <span class="course-category">${course.category}</span>
          </div>
          <div class="course-content">
            <div class="course-meta">
              <span>📶 ${course.level}</span>
              <span>🗣️ ${course.language.toUpperCase()}</span>
            </div>
            <h3 class="course-title">${course.title}</h3>
            <p class="course-desc">${course.description}</p>
            <div class="rating-stars">
              ⭐ ${course.rating.toFixed(1)}
            </div>
            <div class="course-footer">
              <span class="course-price">${course.price === 0 ? "Free" : `$${course.price}`}</span>
              <button class="btn btn-primary btn-xs" onclick="Courses.handleEnrollmentClick('${course.id}')">${btnLabel}</button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  },

  getSvgThumbnail(category) {
    let color = "#6366f1"; // Web Dev
    if (category === "Artificial Intelligence") color = "#06b6d4";
    if (category === "Design") color = "#ec4899";

    return `
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="12" fill="${color}" fill-opacity="0.15"/>
        <circle cx="50" cy="50" r="30" stroke="${color}" stroke-width="3" stroke-dasharray="4 4"/>
        <path d="M40 50L47 57L60 43" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  },

  handleEnrollmentClick(courseId) {
    const user = window.Session.getCurrentUser();
    if (!user) {
      window.showToast("Please log in to purchase or view courses.", "warning");
      setTimeout(() => { window.location.href = "login.html"; }, 1000);
      return;
    }

    const progressList = window.DB.get("progress");
    const isEnrolled = progressList.some(p => p.userId === user.id && p.courseId === courseId);

    if (isEnrolled) {
      window.location.href = `course-details.html?id=${courseId}`;
    } else {
      // Direct enrollment for free or open checkout modal
      const course = window.DB.get("courses").find(c => c.id === courseId);
      if (course.price === 0) {
        this.completeEnrollment(user.id, courseId, 0, "");
      } else {
        this.openCheckoutModal(course);
      }
    }
  },

  // 2. Checkout Modal & E-Commerce Flow
  openCheckoutModal(course) {
    let modal = document.getElementById("checkout-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "checkout-modal";
      modal.className = "modal-overlay";
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-card card">
        <div class="modal-header">
          <h2>Secure Checkout</h2>
          <span class="modal-close" onclick="Courses.closeCheckoutModal()">✕</span>
        </div>
        <div style="margin-bottom: 1.5rem;">
          <h4>${course.title}</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem;">Category: ${course.category} | Level: ${course.level}</p>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem;">
          <span>Standard Price:</span>
          <span>$${course.price}</span>
        </div>
        <div class="form-group">
          <label for="coupon-input">Promo / Coupon Code</label>
          <div style="display: flex; gap: 0.5rem;">
            <input type="text" id="coupon-input" class="form-input" style="flex-grow:1" placeholder="e.g. WELCOME20">
            <button class="btn btn-secondary" onclick="Courses.applyCoupon(${course.price})">Apply</button>
          </div>
          <span id="coupon-feedback" style="font-size: 0.8rem; font-weight: 600;"></span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: 800; color: var(--color-secondary); margin-bottom: 1.5rem;">
          <span>Total Price:</span>
          <span id="checkout-total-price" data-base-price="${course.price}">$${course.price}</span>
        </div>
        <div class="form-group">
          <label>Simulated Card Number</label>
          <input type="text" class="form-input" placeholder="4111 2222 3333 4444" value="4111 2222 3333 4444">
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
          <button class="btn btn-secondary" style="flex:1" onclick="Courses.closeCheckoutModal()">Cancel</button>
          <button class="btn btn-primary" style="flex:2" onclick="Courses.submitPayment('${course.id}')">Submit Purchase</button>
        </div>
      </div>
    `;

    modal.classList.add("open");
  },

  closeCheckoutModal() {
    document.getElementById("checkout-modal")?.classList.remove("open");
  },

  applyCoupon(basePrice) {
    const val = (document.getElementById("coupon-input")?.value || "").toUpperCase().trim();
    const feedback = document.getElementById("coupon-feedback");
    const totalSpan = document.getElementById("checkout-total-price");

    if (!feedback || !totalSpan) return;

    if (this.coupons[val]) {
      const discount = this.coupons[val];
      const finalPrice = (basePrice * (1 - discount)).toFixed(2);
      totalSpan.textContent = `$${finalPrice}`;
      totalSpan.setAttribute("data-applied-coupon", val);
      feedback.textContent = `Coupon applied! ${discount * 100}% off code.`;
      feedback.style.color = "var(--accent-success)";
    } else {
      totalSpan.textContent = `$${basePrice}`;
      totalSpan.removeAttribute("data-applied-coupon");
      feedback.textContent = "Invalid discount coupon.";
      feedback.style.color = "var(--accent-danger)";
    }
  },

  submitPayment(courseId) {
    const user = window.Session.getCurrentUser();
    if (!user) return;

    const totalSpan = document.getElementById("checkout-total-price");
    const finalAmount = parseFloat(totalSpan.textContent.replace('$', ''));
    const couponCode = totalSpan.getAttribute("data-applied-coupon") || "";

    this.completeEnrollment(user.id, courseId, finalAmount, couponCode);
    this.closeCheckoutModal();
  },

  completeEnrollment(userId, courseId, amount, couponCode) {
    // 1. Log Payment
    const payment = {
      id: "pay_" + Date.now(),
      userId,
      courseId,
      amount,
      couponCode,
      date: new Date().toISOString()
    };
    window.DB.insert("payments", payment);

    // 2. Log Progress Initializer
    const progress = {
      id: `progress_${userId}_${courseId}`,
      userId,
      courseId,
      completedLessons: [],
      completedQuizzes: [],
      bookmarks: [],
      notes: [],
      pointsEarned: 0,
      completed: false,
      completedAt: null
    };
    window.DB.insert("progress", progress);

    // 3. Award Starting Points
    window.awardPoints(50, "Course Enrollment Bonus!");

    window.showToast("Enrollment successful! Loading Course Player...", "success");

    setTimeout(() => {
      window.location.href = `course-details.html?id=${courseId}`;
    }, 1500);
  },

  // 3. Learning Pathways Engine
  renderLearningPaths() {
    const container = document.getElementById("paths-container");
    if (!container) return;

    const user = window.Session.getCurrentUser();
    const progress = window.DB.get("progress").filter(p => p.userId === user?.id);

    // Simple definition of Learning paths
    const pathways = [
      {
        name: "Web Developer Path",
        steps: ["c_html", "c_css", "c_js", "c_react"],
        desc: "Go from structural page layouts to full dynamic Single Page App frameworks."
      },
      {
        name: "AI Specialist Path",
        steps: ["c_ai_basics"],
        desc: "Master intelligence networks and deep instruction generation."
      }
    ];

    container.innerHTML = pathways.map(path => {
      let nodeHtml = path.steps.map(courseId => {
        const course = window.DB.get("courses").find(c => c.id === courseId);
        if (!course) return "";

        const userProg = progress.find(p => p.courseId === courseId);
        const isCompleted = userProg?.completed;
        const isEnrolled = !!userProg;

        let statusClass = "";
        let statusBadge = "🔒 Locked";

        if (isCompleted) {
          statusClass = "completed";
          statusBadge = "✅ Completed";
        } else if (isEnrolled) {
          statusClass = "active";
          statusBadge = "⚡ Active";
        }

        return `
          <div class="path-node ${statusClass}">
            <div style="font-weight: 800; font-size: 0.8rem; margin-bottom: 0.25rem;">${statusBadge}</div>
            <a href="course-details.html?id=${courseId}" style="font-weight: 600;">${course.title.split(":")[0]}</a>
          </div>
        `;
      }).filter(n => n !== "").join('<div class="path-arrow">➔</div>');

      return `
        <div class="path-box">
          <h3>🛣️ ${path.name}</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">${path.desc}</p>
          <div class="path-steps">
            ${nodeHtml}
          </div>
        </div>
      `;
    }).join('');
  }
};

window.Courses = Courses;
