async function portalRequest(url, options = {}) {
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

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

function formatDate(value) {
  if (!value) {
    return "--";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function userInitials(name) {
  return String(name || "Student")
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function applyShell(student, activePage) {
  const sidebarName = document.getElementById("sidebarName");
  const sidebarMeta = document.getElementById("sidebarMeta");
  const topbarName = document.getElementById("topbarName");
  const topbarRegNo = document.getElementById("topbarRegNo");
  const accountInitials = document.getElementById("accountInitials");

  if (sidebarName) {
    sidebarName.textContent = student.fullName;
  }

  if (sidebarMeta) {
    sidebarMeta.textContent = `${student.regNo} | ${student.role.toUpperCase()}`;
  }

  if (topbarName) {
    topbarName.textContent = student.fullName;
  }

  if (topbarRegNo) {
    topbarRegNo.textContent = student.regNo;
  }

  if (accountInitials) {
    accountInitials.textContent = userInitials(student.fullName) || "ST";
  }

  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === activePage);
  });

  document.querySelectorAll("[data-admin-only]").forEach((element) => {
    element.hidden = student.role !== "admin";
  });
}

async function ensureSession(activePage, { adminOnly = false } = {}) {
  try {
    const { student } = await portalRequest("/api/auth/me");

    if (adminOnly && student.role !== "admin") {
      window.location.href = "/dashboard";
      return null;
    }

    applyShell(student, activePage);
    return student;
  } catch (error) {
    window.location.href = "/";
    return null;
  }
}

function bindLogout() {
  const logoutButton = document.getElementById("logoutButton");

  if (!logoutButton || logoutButton.dataset.bound === "true") {
    return;
  }

  logoutButton.dataset.bound = "true";

  logoutButton.addEventListener("click", async () => {
    try {
      await portalRequest("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.href = "/";
    }
  });
}

window.portalCommon = {
  request: portalRequest,
  escapeHtml,
  formatDate,
  ensureSession,
  bindLogout,
};
