const authMessage = document.getElementById("authMessage");
const loginForm = document.getElementById("loginForm");
const pageTitle = document.getElementById("pageTitle");
const portalLabel = document.getElementById("portalLabel");
const portalName = document.getElementById("portalName");
const portalHeadline = document.getElementById("portalHeadline");
const portalSubheadline = document.getElementById("portalSubheadline");
const totalUsersCard = document.getElementById("totalUsersCard");
const adminUsersCard = document.getElementById("adminUsersCard");
const requestCountCard = document.getElementById("requestCountCard");
const latestUsersList = document.getElementById("latestUsersList");

function showMessage(message, tone = "error") {
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
  try {
    await request("/api/auth/me");
    window.location.href = "/dashboard";
  } catch (error) {
    return null;
  }
}

async function loadLandingData() {
  try {
    const payload = await request("/api/public/landing");
    pageTitle.textContent = `${payload.portalName} Login`;
    portalLabel.textContent = `${payload.portalName} ${payload.portalLabel}`;
    portalName.textContent = payload.portalName;
    portalHeadline.textContent = payload.headline;
    portalSubheadline.textContent = payload.subheadline;
    totalUsersCard.textContent = `${payload.stats.totalUsers} total users in MongoDB`;
    adminUsersCard.textContent = `${payload.stats.totalAdmins} admins with CRUD access`;
    requestCountCard.textContent = `${payload.stats.totalRequests} requests stored in MongoDB`;

    latestUsersList.innerHTML = payload.latestUsers.length
      ? payload.latestUsers
          .map(
            (user) => `
              <p>${user.fullName} | ${user.regNo} | ${String(user.role).toUpperCase()}</p>
            `
          )
          .join("")
      : "<p>No users yet.</p>";
  } catch (error) {
    return null;
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    showMessage("Signing you in...", "success");
    await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    window.location.href = "/dashboard";
  } catch (error) {
    showMessage(error.message);
  }
});

checkSession();
loadLandingData();
