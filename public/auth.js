const authMessage = document.getElementById("authMessage");
const loginForm = document.getElementById("loginForm");
const pageTitle = document.getElementById("pageTitle");
const loginPortalName = document.getElementById("loginPortalName");
const loginSubtitle = document.getElementById("loginSubtitle");
const loginDatabase = document.getElementById("loginDatabase");
const totalStudents = document.getElementById("totalStudents");
const totalRequests = document.getElementById("totalRequests");
const latestUsersList = document.getElementById("latestUsersList");

function showMessage(message, tone = "error") {
  if (!authMessage) {
    return;
  }

  authMessage.textContent = message;
  authMessage.dataset.tone = tone;
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload;
}

async function checkSession() {
  if (!loginForm) {
    return;
  }

  try {
    await request("/api/auth/me");
    window.location.href = "/dashboard";
  } catch (error) {
    return null;
  }
}

async function loadLandingData() {
  if (!loginForm) {
    return;
  }

  try {
    const payload = await request("/api/public/landing");

    if (pageTitle) {
      pageTitle.textContent = `${payload.portalName} Student Login`;
    }

    if (loginPortalName) {
      loginPortalName.textContent = `${payload.portalName} Student Login`;
    }

    if (loginSubtitle) {
      loginSubtitle.textContent = payload.subheadline;
    }

    if (loginDatabase) {
      loginDatabase.textContent = payload.databaseName;
    }

    if (totalStudents) {
      totalStudents.textContent = String(payload.stats.totalStudents);
    }

    if (totalRequests) {
      totalRequests.textContent = String(payload.stats.totalRequests);
    }

    if (latestUsersList) {
      latestUsersList.innerHTML = payload.latestUsers.length
        ? payload.latestUsers
            .map(
              (user) => `
                <li>
                  <strong>${user.fullName}</strong>
                  <span>${user.regNo} | ${String(user.role).toUpperCase()}</span>
                </li>
              `
            )
            .join("")
        : "<li><strong>No users found</strong><span>Register a student to see records here.</span></li>";
    }
  } catch (error) {
    return null;
  }
}

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      showMessage("Signing in...", "success");
      await request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      window.location.href = "/dashboard";
    } catch (error) {
      showMessage(error.message);
    }
  });
}

checkSession();
loadLandingData();
