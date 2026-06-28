// --- LDS AUTHENTICATION & PROFILE ENGINE ---

const Auth = {
  login(email, password) {
    const users = window.DB.get("users");
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      if (user.role === "instructor" && !user.isApproved) {
        window.showToast("Your instructor account is pending administrator approval.", "warning");
        return false;
      }
      window.Session.setCurrentUser(user);
      window.showToast(`Welcome back, ${user.name}!`, "success");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
      return true;
    } else {
      window.showToast("Invalid email or password.", "danger");
      return false;
    }
  },

  register(name, email, password, role) {
    const users = window.DB.get("users");
    const exists = users.some(u => u.email === email);

    if (exists) {
      window.showToast("An account with this email already exists.", "danger");
      return false;
    }

    const newUser = {
      id: "u_" + Date.now(),
      email,
      password,
      name,
      role,
      bio: "",
      avatar: "",
      preferences: {
        language: "en",
        theme: "dark",
        contrast: "normal"
      },
      points: 50, // Welcome points
      badges: ["Beginner Learner"],
      isApproved: role !== "instructor", // Instructors need admin approval
      createdAt: new Date().toISOString()
    };

    window.DB.insert("users", newUser);

    if (role === "instructor") {
      window.showToast("Registration successful! Your instructor profile is pending administrator approval.", "warning");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2500);
    } else {
      window.Session.setCurrentUser(newUser);
      window.showToast("Registration successful! Welcome to LDS E-Learning Platform.", "success");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    }
    return true;
  },

  // Renders the profile.html workspace
  initProfilePage() {
    const user = window.Session.getCurrentUser();
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    // Populate Fields
    const nameEl = document.getElementById("profile-name");
    const emailEl = document.getElementById("profile-email");
    const bioEl = document.getElementById("profile-bio");
    const langEl = document.getElementById("pref-lang");
    const themeEl = document.getElementById("pref-theme");
    const contrastEl = document.getElementById("pref-contrast");
    
    if (nameEl) nameEl.value = user.name;
    if (emailEl) emailEl.value = user.email;
    if (bioEl) bioEl.value = user.bio || "";
    if (langEl) langEl.value = user.preferences.language || "en";
    if (themeEl) themeEl.value = user.preferences.theme || "dark";
    if (contrastEl) contrastEl.value = user.preferences.contrast || "normal";

    // Draw Points & Badges
    const pointsText = document.getElementById("profile-points-val");
    if (pointsText) pointsText.textContent = user.points || 0;

    const badgeContainer = document.getElementById("profile-badge-grid");
    if (badgeContainer) {
      badgeContainer.innerHTML = "";
      const badges = user.badges || [];
      if (badges.length === 0) {
        badgeContainer.innerHTML = "<p style='color: var(--text-muted)'>No badges earned yet. Start learning!</p>";
      } else {
        badges.forEach(b => {
          let icon = "🎒";
          if (b === "Quiz Master") icon = "🎓";
          if (b === "Course Champion") icon = "🏆";
          if (b === "Beginner Learner") icon = "🌟";
          
          badgeContainer.innerHTML += `
            <div class="badge-item">
              <div class="badge-icon">${icon}</div>
              <div class="badge-name">${b}</div>
            </div>
          `;
        });
      }
    }

    // Draw Avatar
    this.renderAvatarPreview(user.avatar || "");
  },

  renderAvatarPreview(src) {
    const preview = document.getElementById("avatar-preview");
    if (!preview) return;
    if (src) {
      preview.innerHTML = `<img src="${src}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
    } else {
      const user = window.Session.getCurrentUser();
      const initials = user ? user.name.split(' ').map(n=>n[0]).join('') : "ES";
      preview.innerHTML = `<div class="nav-avatar" style="width: 100%; height: 100%; font-size: 2rem;">${initials}</div>`;
    }
  },

  handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target.result;
      const user = window.Session.getCurrentUser();
      user.avatar = base64Data;
      
      // Update DB and active Session
      window.DB.update("users", user.id, { avatar: base64Data });
      window.Session.setCurrentUser(user);
      
      this.renderAvatarPreview(base64Data);
      
      // Sync navbar avatar if applicable
      const navAvatar = document.querySelector(".nav-avatar");
      if (navAvatar) {
        navAvatar.style.background = `url(${base64Data})`;
        navAvatar.style.backgroundSize = "cover";
        navAvatar.textContent = "";
      }
      
      window.showToast("Profile picture updated successfully!", "success");
    };
    reader.readAsDataURL(file);
  },

  saveProfileChanges() {
    const user = window.Session.getCurrentUser();
    if (!user) return;

    const name = document.getElementById("profile-name").value;
    const bio = document.getElementById("profile-bio").value;
    const lang = document.getElementById("pref-lang").value;
    const theme = document.getElementById("pref-theme").value;
    const contrast = document.getElementById("pref-contrast").value;

    user.name = name;
    user.bio = bio;
    user.preferences = {
      language: lang,
      theme,
      contrast
    };

    window.DB.update("users", user.id, {
      name: user.name,
      bio: user.bio,
      preferences: user.preferences
    });

    window.Session.setCurrentUser(user);
    
    // Apply visual themes instantly
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-contrast", contrast);
    
    // Re-inject navbar
    window.location.reload();
  },

  // GDPR - Compliance Tools
  downloadUserData() {
    const user = window.Session.getCurrentUser();
    if (!user) return;

    // Gather records relating to user
    const progress = window.DB.get("progress").filter(p => p.userId === user.id);
    const payments = window.DB.get("payments").filter(p => p.userId === user.id);
    const certificates = window.DB.get("certificates").filter(p => p.userId === user.id);

    const fullProfile = {
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        preferences: user.preferences,
        points: user.points,
        badges: user.badges,
        createdAt: user.createdAt
      },
      progress,
      payments,
      certificates
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullProfile, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `lds_profile_${user.id}.json`);
    dlAnchor.click();
    window.showToast("Your platform data backup has started downloading.", "success");
  },

  deleteUserAccount() {
    const user = window.Session.getCurrentUser();
    if (!user) return;

    if (confirm("Are you absolutely sure you want to delete your account? This will purge all progress, points, and certificates. This action is irreversible.")) {
      // Delete rows
      window.DB.delete("users", user.id);
      
      const progress = window.DB.get("progress");
      window.DB.set("progress", progress.filter(p => p.userId !== user.id));
      
      const payments = window.DB.get("payments");
      window.DB.set("payments", payments.filter(p => p.userId !== user.id));
      
      const certs = window.DB.get("certificates");
      window.DB.set("certificates", certs.filter(c => c.userId !== user.id));

      window.Session.setCurrentUser(null);
      window.showToast("Your account has been deleted.", "warning");
      setTimeout(() => {
        window.location.href = "register.html";
      }, 1500);
    }
  }
};

window.Auth = Auth;
