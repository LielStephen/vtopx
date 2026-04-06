const overviewStats = document.getElementById("overviewStats");
const welcomeTitle = document.getElementById("welcomeTitle");
const welcomeMeta = document.getElementById("welcomeMeta");
const spotlightList = document.getElementById("spotlightList");
const quickLinksList = document.getElementById("quickLinksList");
const todayScheduleList = document.getElementById("todayScheduleList");
const requestSummary = document.getElementById("requestSummary");
const recentRequestsList = document.getElementById("recentRequestsList");

function renderCards(container, items, mapper, emptyMessage) {
  if (!items.length) {
    container.innerHTML = `<div class="empty-state">${emptyMessage}</div>`;
    return;
  }

  container.innerHTML = items.map(mapper).join("");
}

async function loadDashboard() {
  await window.portalCommon.ensureSession("dashboard");
  window.portalCommon.bindLogout();

  try {
    const payload = await window.portalCommon.request("/api/portal/dashboard");
    const { escapeHtml, formatDate } = window.portalCommon;

    welcomeTitle.textContent = `Welcome, ${payload.student.fullName.split(" ")[0]}`;
    welcomeMeta.textContent = `${payload.student.program} | ${payload.student.semester} | ${payload.student.role.toUpperCase()}`;

    overviewStats.innerHTML = [
      { label: "Attendance Avg", value: `${payload.overview.attendanceAverage}%` },
      { label: "Low Attendance", value: payload.overview.lowAttendanceCount },
      { label: "Pending Assignments", value: payload.overview.pendingAssignments },
      { label: "Published Marks", value: payload.overview.publishedMarks },
    ]
      .map(
        (item) => `
          <article class="stat-card">
            <span>${escapeHtml(item.label)}</span>
            <strong>${escapeHtml(item.value)}</strong>
          </article>
        `
      )
      .join("");

    renderCards(
      spotlightList,
      payload.spotlight,
      (item) => `
        <article class="data-card">
          <div class="card-topline">
            <span class="badge-chip">${escapeHtml(item.category)}</span>
            <small>${formatDate(item.postedOn)}</small>
          </div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.detail)}</p>
        </article>
      `,
      "No spotlight notices yet."
    );

    renderCards(
      quickLinksList,
      payload.quickLinks,
      (item) => `
        <article class="data-card">
          <div class="card-code">${escapeHtml(item.shortCode)}</div>
          <div>
            <h3>${escapeHtml(item.label)}</h3>
            <p>${escapeHtml(item.description)}</p>
          </div>
        </article>
      `,
      "No quick links available."
    );

    renderCards(
      todayScheduleList,
      payload.todaySchedule,
      (item) => `
        <article class="data-card">
          <div class="card-topline">
            <strong>${escapeHtml(item.startTime)} - ${escapeHtml(item.endTime)}</strong>
            <span class="badge-chip subtle-chip">${escapeHtml(item.type)}</span>
          </div>
          <h3>${escapeHtml(item.courseCode)} | ${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.faculty)} | ${escapeHtml(item.venue)}</p>
        </article>
      `,
      "No classes scheduled for today."
    );

    requestSummary.innerHTML = [
      `Total ${payload.requestStats.total}`,
      `Pending ${payload.requestStats.pending}`,
      `In Review ${payload.requestStats.inReview}`,
      `Approved ${payload.requestStats.approved}`,
    ]
      .map((item) => `<span class="badge-chip subtle-chip">${escapeHtml(item)}</span>`)
      .join("");

    renderCards(
      recentRequestsList,
      payload.requests.slice(0, 4),
      (item) => `
        <article class="data-card">
          <div class="card-topline">
            <span class="badge-chip subtle-chip">${escapeHtml(item.requestType)}</span>
            <span class="status-pill">${escapeHtml(item.status)}</span>
          </div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
        </article>
      `,
      "No requests submitted yet."
    );
  } catch (error) {
    console.error(error);
  }
}

loadDashboard();
