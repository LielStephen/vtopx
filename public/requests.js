const requestTitle = document.getElementById("requestTitle");
const requestMeta = document.getElementById("requestMeta");
const requestForm = document.getElementById("requestForm");
const requestMessage = document.getElementById("requestMessage");
const requestTypeField = document.getElementById("requestTypeField");
const leaveFields = document.getElementById("leaveFields");
const requestStats = document.getElementById("requestStats");
const requestHistory = document.getElementById("requestHistory");

function setRequestMessage(message, tone = "error") {
  requestMessage.textContent = message;
  requestMessage.dataset.tone = tone;
}

function toggleLeaveFields() {
  const isLeave = requestTypeField.value === "Leave Request";
  leaveFields.classList.toggle("is-visible", isLeave);
  leaveFields.querySelectorAll("input").forEach((input) => {
    input.required = isLeave;
  });
}

async function loadRequestsPage() {
  await window.portalCommon.ensureSession("requests");
  window.portalCommon.bindLogout();

  try {
    const payload = await window.portalCommon.request("/api/portal/requests");
    const { escapeHtml, formatDate } = window.portalCommon;

    requestTitle.textContent = `${payload.student.fullName}'s requests`;
    requestMeta.textContent = `Logged in as ${payload.student.role.toUpperCase()} | ${payload.student.regNo}`;

    requestTypeField.innerHTML = [
      '<option value="">Choose a request</option>',
      ...payload.requestTypes.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`),
    ].join("");
    toggleLeaveFields();

    requestStats.innerHTML = [
      `Total ${payload.requestStats.total}`,
      `Pending ${payload.requestStats.pending}`,
      `In Review ${payload.requestStats.inReview}`,
      `Approved ${payload.requestStats.approved}`,
    ]
      .map((item) => `<span class="badge-chip subtle-chip">${escapeHtml(item)}</span>`)
      .join("");

    requestHistory.innerHTML = payload.requests.length
      ? payload.requests
          .map((item) => {
            const dateRange = item.fromDate && item.toDate
              ? `<span>${formatDate(item.fromDate)} to ${formatDate(item.toDate)}</span>`
              : "";

            return `
              <article class="data-card">
                <div class="card-topline">
                  <span class="badge-chip subtle-chip">${escapeHtml(item.requestType)}</span>
                  <span class="status-pill">${escapeHtml(item.status)}</span>
                </div>
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.description)}</p>
                <div class="card-actions">
                  <span>${formatDate(item.createdAt)}</span>
                  ${item.courseCode ? `<span>${escapeHtml(item.courseCode)}</span>` : ""}
                  ${dateRange}
                </div>
              </article>
            `;
          })
          .join("")
      : '<div class="empty-state">No requests submitted yet.</div>';
  } catch (error) {
    console.error(error);
  }
}

requestTypeField.addEventListener("change", toggleLeaveFields);

requestForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(requestForm);
  const payload = Object.fromEntries(formData.entries());

  if (!payload.courseCode) {
    delete payload.courseCode;
  }

  try {
    setRequestMessage("Submitting request...", "success");
    await window.portalCommon.request("/api/portal/requests", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    requestForm.reset();
    toggleLeaveFields();
    setRequestMessage("Request created successfully.", "success");
    await loadRequestsPage();
  } catch (error) {
    setRequestMessage(error.message);
  }
});

loadRequestsPage();
