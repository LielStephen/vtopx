const academicTitle = document.getElementById("academicTitle");
const academicMeta = document.getElementById("academicMeta");
const courseList = document.getElementById("courseList");
const todayTitle = document.getElementById("todayTitle");
const todayScheduleList = document.getElementById("todayScheduleList");
const marksTableBody = document.getElementById("marksTableBody");
const assignmentList = document.getElementById("assignmentList");
const academicMessage = document.getElementById("academicMessage");

function setAcademicMessage(message, tone = "error") {
  academicMessage.textContent = message;
  academicMessage.dataset.tone = tone;
}

async function loadAcademics() {
  await window.portalCommon.ensureSession("academics");
  window.portalCommon.bindLogout();

  try {
    const payload = await window.portalCommon.request("/api/portal/academics");
    const { escapeHtml, formatDate } = window.portalCommon;

    academicTitle.textContent = payload.student.program;
    academicMeta.textContent = `${payload.student.semester} | ${payload.student.school}`;
    todayTitle.textContent = `${payload.today} timetable`;

    courseList.innerHTML = payload.courses
      .map(
        (course) => `
          <article class="data-card">
            <div class="card-topline">
              <strong>${escapeHtml(course.code)}</strong>
              <span class="badge-chip subtle-chip">${escapeHtml(course.attendancePercentage)}%</span>
            </div>
            <h3>${escapeHtml(course.title)}</h3>
            <p>${escapeHtml(course.faculty)} | ${escapeHtml(course.slot)} | ${escapeHtml(course.room)}</p>
          </article>
        `
      )
      .join("");

    todayScheduleList.innerHTML = payload.todaySchedule.length
      ? payload.todaySchedule
          .map(
            (item) => `
              <article class="data-card">
                <div class="card-topline">
                  <strong>${escapeHtml(item.startTime)} - ${escapeHtml(item.endTime)}</strong>
                  <span class="badge-chip subtle-chip">${escapeHtml(item.type)}</span>
                </div>
                <h3>${escapeHtml(item.courseCode)} | ${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.faculty)} | ${escapeHtml(item.venue)}</p>
              </article>
            `
          )
          .join("")
      : '<div class="empty-state">No classes scheduled for today.</div>';

    marksTableBody.innerHTML = payload.assessments
      .map((item) => {
        const marks =
          item.scoredMarks === null || item.scoredMarks === undefined
            ? `-- / ${item.maxMarks}`
            : `${item.scoredMarks} / ${item.maxMarks}`;

        return `
          <tr>
            <td>${escapeHtml(item.courseCode)}</td>
            <td>
              <strong>${escapeHtml(item.title)}</strong>
              <small>${formatDate(item.examDate)}</small>
            </td>
            <td>${escapeHtml(item.weightage)}</td>
            <td>${escapeHtml(marks)}</td>
            <td><span class="status-pill">${escapeHtml(item.status)}</span></td>
          </tr>
        `;
      })
      .join("");

    assignmentList.innerHTML = payload.assignments.length
      ? payload.assignments
          .map(
            (item) => `
              <article class="data-card">
                <div class="card-topline">
                  <strong>${escapeHtml(item.courseCode)}</strong>
                  <span class="status-pill">${escapeHtml(item.status)}</span>
                </div>
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.instructions)}</p>
                <div class="card-actions">
                  <span>Due ${formatDate(item.dueDate)}</span>
                  <button
                    class="secondary-button assignment-submit"
                    type="button"
                    data-assignment-id="${escapeHtml(item._id)}"
                    ${item.status === "Submitted" ? "disabled" : ""}
                  >
                    ${item.status === "Submitted" ? "Submitted" : "Mark Submitted"}
                  </button>
                </div>
              </article>
            `
          )
          .join("")
      : '<div class="empty-state">No assignments available.</div>';
  } catch (error) {
    console.error(error);
  }
}

assignmentList.addEventListener("click", async (event) => {
  const button = event.target.closest(".assignment-submit");

  if (!button) {
    return;
  }

  try {
    setAcademicMessage("Updating assignment...", "success");
    await window.portalCommon.request(`/api/portal/assignments/${button.dataset.assignmentId}/submit`, {
      method: "POST",
    });
    setAcademicMessage("Assignment updated successfully.", "success");
    await loadAcademics();
  } catch (error) {
    setAcademicMessage(error.message);
  }
});

loadAcademics();
