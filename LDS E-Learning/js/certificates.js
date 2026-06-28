// --- LDS VERIFIABLE CERTIFICATE ENGINE ---

const Certificates = {
  render(courseId) {
    const user = window.Session.getCurrentUser();
    const container = document.getElementById("certificate-preview-container");
    if (!container || !user) return;

    const certs = window.DB.get("certificates");
    const cert = certs.find(c => c.userId === user.id && c.courseId === courseId);

    if (!cert) {
      container.innerHTML = `
        <div class="card" style="text-align: center; padding: 4rem;">
          <h3>Certificate Pending</h3>
          <p style="color: var(--text-muted); margin: 1rem 0;">You have not earned a certificate for this course yet. Complete all lessons and pass the timed assessment.</p>
          <button class="btn btn-primary" onclick="window.location.href='course-details.html?id=${courseId}'">Resume Course</button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;" class="no-print">
        <h2>Verify & Download Diploma</h2>
        <div style="display:flex; gap:1rem;">
          <button class="btn btn-secondary" onclick="window.location.href='course-details.html?id=${courseId}'">Back to Class</button>
          <button class="btn btn-primary" onclick="window.print()">Download PDF / Print</button>
        </div>
      </div>
      
      <div class="certificate-preview-box">
        <div class="cert-verify no-print" style="margin-bottom:1rem; display:inline-block; padding:0.25rem 0.75rem; background:#f0f9ff; border:1px solid #bae6fd; color:#0369a1; border-radius:4px; font-weight:600;">
          ✓ Verifiable Certificate
        </div>
        <div class="cert-title">LDS E-LEARNING ACADEMY</div>
        <div style="font-size: 1.1rem; letter-spacing: 0.15em; font-weight: 500; color: #475569; margin: 1rem 0;">DIPLOMA OF COMPLETION</div>
        <div style="color: #64748b; font-style: italic; margin-top: 1rem;">This credential confirms that</div>
        <div class="cert-name">${cert.userName}</div>
        <div class="cert-details">
          has successfully satisfied all academic and timed quiz requirements for the curriculum specialization:
          <br>
          <strong style="color: #1e1b4b; font-size: 1.4rem; display: inline-block; margin-top: 0.5rem;">${cert.courseTitle}</strong>
        </div>
        <div style="margin-top: 1.5rem; font-size: 0.95rem; color: #475569;">
          Issued on: <strong>${new Date(cert.date).toLocaleDateString()}</strong>
        </div>
        
        <div class="cert-footer">
          <div class="cert-sig">
            <strong>Dr. Sarah Connor</strong>
            <div style="color: #64748b; font-size: 0.8rem;">Lead Dean of Studies</div>
          </div>
          <div>
            <div class="cert-verify">VERIFICATION ID: ${cert.id}</div>
            <div class="cert-verify" style="margin-top:0.25rem;">SECURE HASH: ${cert.verifyHash}</div>
          </div>
        </div>
      </div>

      <div class="card no-print" style="margin-top: 2rem; max-width: 800px; margin-left: auto; margin-right: auto;">
        <h3>Alternative Credential Verification</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin: 0.5rem 0 1rem 0;">Verify this certificate hash on the global verifiable credential network (e.g. Credly standard proof).</p>
        <div style="display:flex; gap:0.5rem;">
          <input type="text" id="verify-hash-input" class="form-input" style="flex-grow:1;" placeholder="Enter Secure Hash, e.g. ${cert.verifyHash}">
          <button class="btn btn-secondary" onclick="Certificates.verifyHashInput()">Validate Hash</button>
        </div>
        <div id="verify-hash-result" style="margin-top:1rem; font-weight:600; font-size:0.9rem;"></div>
      </div>
    `;
  },

  verifyHashInput() {
    const hash = (document.getElementById("verify-hash-input")?.value || "").trim();
    const resultDiv = document.getElementById("verify-hash-result");
    if (!resultDiv) return;

    if (!hash) {
      resultDiv.textContent = "Please input a hash.";
      resultDiv.style.color = "var(--accent-danger)";
      return;
    }

    const certs = window.DB.get("certificates");
    const found = certs.find(c => c.verifyHash === hash);

    if (found) {
      resultDiv.innerHTML = `✅ Authentic Credential Found!<br>Student: <strong>${found.userName}</strong><br>Course: <strong>${found.courseTitle}</strong><br>Date: ${new Date(found.date).toLocaleDateString()}`;
      resultDiv.style.color = "var(--accent-success)";
    } else {
      resultDiv.textContent = "❌ Credential Not Found. The secure hash is invalid or revoked.";
      resultDiv.style.color = "var(--accent-danger)";
    }
  }
};

window.Certificates = Certificates;
