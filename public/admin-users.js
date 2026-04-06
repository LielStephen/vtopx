const userStats = document.getElementById("userStats");
const userForm = document.getElementById("userForm");
const userIdField = document.getElementById("userIdField");
const userTableBody = document.getElementById("userTableBody");
const adminMessage = document.getElementById("adminMessage");
const formTitle = document.getElementById("formTitle");
const cancelEditButton = document.getElementById("cancelEditButton");

let cachedUsers = [];

function setAdminMessage(message, tone = "error") {
  adminMessage.textContent = message;
  adminMessage.dataset.tone = tone;
}

function resetForm() {
  userForm.reset();
  userIdField.value = "";
  formTitle.textContent = "Add user";
}

function startEdit(userId) {
  const user = cachedUsers.find((item) => item.id === userId);

  if (!user) {
    return;
  }

  userIdField.value = user.id;
  userForm.fullName.value = user.fullName;
  userForm.regNo.value = user.regNo;
  userForm.email.value = user.email;
  userForm.department.value = user.department;
  userForm.academicYear.value = user.academicYear;
  userForm.role.value = user.role;
  userForm.password.value = "";
  formTitle.textContent = `Edit ${user.fullName}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function loadUsers() {
  await window.portalCommon.ensureSession("admin", { adminOnly: true });
  window.portalCommon.bindLogout();

  try {
    const payload = await window.portalCommon.request("/api/admin/users");
    const { escapeHtml } = window.portalCommon;

    cachedUsers = payload.users;

    userStats.innerHTML = [
      { label: "Total Users", value: payload.stats.total },
      { label: "Admins", value: payload.stats.admins },
      { label: "Students", value: payload.stats.students },
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

    userTableBody.innerHTML = payload.users
      .map(
        (user) => `
          <tr>
            <td>${escapeHtml(user.fullName)}</td>
            <td>${escapeHtml(user.regNo)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td><span class="status-pill">${escapeHtml(user.role)}</span></td>
            <td>${escapeHtml(user.department)}</td>
            <td>
              <div class="table-actions">
                <button type="button" class="secondary-button table-action edit-user" data-user-id="${escapeHtml(user.id)}">Edit</button>
                <button type="button" class="ghost-button table-action delete-user" data-user-id="${escapeHtml(user.id)}">Delete</button>
              </div>
            </td>
          </tr>
        `
      )
      .join("");
  } catch (error) {
    console.error(error);
  }
}

userForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(userForm);
  const payload = Object.fromEntries(formData.entries());
  const editingUserId = userIdField.value;

  if (!payload.password) {
    delete payload.password;
  }

  delete payload.userId;

  try {
    setAdminMessage(editingUserId ? "Updating user..." : "Creating user...", "success");
    await window.portalCommon.request(
      editingUserId ? `/api/admin/users/${editingUserId}` : "/api/admin/users",
      {
        method: editingUserId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      }
    );
    setAdminMessage(editingUserId ? "User updated successfully." : "User created successfully.", "success");
    resetForm();
    await loadUsers();
  } catch (error) {
    setAdminMessage(error.message);
  }
});

cancelEditButton.addEventListener("click", () => {
  resetForm();
  setAdminMessage("", "success");
});

userTableBody.addEventListener("click", async (event) => {
  const editButton = event.target.closest(".edit-user");
  const deleteButton = event.target.closest(".delete-user");

  if (editButton) {
    startEdit(editButton.dataset.userId);
    return;
  }

  if (!deleteButton) {
    return;
  }

  if (!window.confirm("Delete this user?")) {
    return;
  }

  try {
    setAdminMessage("Deleting user...", "success");
    await window.portalCommon.request(`/api/admin/users/${deleteButton.dataset.userId}`, {
      method: "DELETE",
    });
    setAdminMessage("User deleted successfully.", "success");
    await loadUsers();
  } catch (error) {
    setAdminMessage(error.message);
  }
});

resetForm();
loadUsers();
