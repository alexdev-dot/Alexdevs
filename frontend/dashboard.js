const API_URL = getApiUrl('api/projects');
const token = localStorage.getItem("adminToken");

if (!token) {
  window.location.href = "admin.html";
}

// Token Management
// Refresh token every 50 minutes (3000000 ms) to keep session alive if browser is open
const TOKEN_REFRESH_INTERVAL = 50 * 60 * 1000;

const refreshToken = async () => {
  try {
    const currentToken = localStorage.getItem("adminToken");
    if (!currentToken) return;

    const res = await fetch(getApiUrl('api/admin/refresh'), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": currentToken,
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("adminToken", data.token);
        console.log("Session extended.");
      }
    } else {
      // If refresh fails (e.g. expired > 1h ago), logout
      console.warn("Session expired. Logging out.");
      localStorage.removeItem("adminToken");
      window.location.href = "admin.html";
    }
  } catch (err) {
    console.error("Error refreshing token:", err);
  }
};

// Start refresh timer
setInterval(refreshToken, TOKEN_REFRESH_INTERVAL);

// DOM Elements
const projectForm = document.getElementById("projectForm");
const projectIdField = document.getElementById("projectId");
const titleField = document.getElementById("title");
const descField = document.getElementById("description");
const imageField = document.getElementById("image");
const linkField = document.getElementById("link");
const techField = document.getElementById("tech");
const projectsList = document.getElementById("projectsList");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Fetch Projects
const fetchProjects = async () => {
  const res = await fetch(API_URL);
  const projects = await res.json();
  renderProjects(projects);
};

// Render Projects in Table
const renderProjects = (projects) => {
  projectsList.innerHTML = "";
  projects.forEach((project) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
            <td>${project.title}</td>
            <td>${project.tech.join(", ")}</td>
            <td class="actions">
                <button class="btn btn-primary" onclick="editProject('${
                  project._id
                }')"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger" onclick="deleteProject('${
                  project._id
                }')"><i class="fas fa-trash"></i></button>
            </td>
        `;
    projectsList.appendChild(tr);
  });
};

// Add/Update Project
projectForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = projectIdField.value;

  // Use FormData for file upload
  const formData = new FormData();
  formData.append("title", titleField.value);
  formData.append("description", descField.value);
  formData.append("link", linkField.value);
  formData.append("tech", techField.value); // Backend handles split

  // Handle Image: File takes precedence over URL text
  const imageFile = document.getElementById("imageUpload").files[0];
  if (imageFile) {
    formData.append("image", imageFile);
  } else {
    // Fallback to URL text if no file selected
    formData.append("image", imageField.value); // Backend will treat this as string
    // Note: For Update, we might need 'existingImage' logic if handled strictly,
    // but let's send 'image' as url.
    // If updating and no new file, we might want to preserve old.
    // Our backend PUT logic: if req.file -> update image. if not -> checks 'existingImage' or keeps old.
    // So we should append 'existingImage' if we are in edit mode and no new file is chosen.
    if (id && !imageFile && imageField.value) {
      formData.append("existingImage", imageField.value);
    }
  }

  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/${id}` : API_URL;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        // Content-Type: 'multipart/form-data', // DO NOT SET THIS MANUALLY with FormData
        "x-auth-token": token,
      },
      body: formData,
    });

    if (res.ok) {
      resetForm();
      await fetchProjects();
      alert("Project saved successfully!");
    } else {
      const err = await res.text();
      console.error("Server Error:", err);
      alert("Action failed: " + err);
    }
  } catch (error) {
    console.error("Network/Script Error:", error);
    alert("Error: " + error.message);
  }
});

// Edit Project
window.editProject = async (id) => {
  const res = await fetch(API_URL);
  const projects = await res.json();
  const project = projects.find((p) => p._id === id);

  if (project) {
    formTitle.textContent = "Edit Project";
    projectIdField.value = project._id;
    titleField.value = project.title;
    descField.value = project.description;

    // Populating image field is tricky.
    // If it's a file path, showing it in file input isn't possible security-wise.
    // We show it in the text field as reference.
    imageField.value = project.image;

    linkField.value = project.link;
    techField.value = project.tech.join(", ");
    submitBtn.textContent = "Update Project";
  }
};

// Delete Project
window.deleteProject = async (id) => {
  if (!confirm("Are you sure?")) return;

  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { "x-auth-token": token },
  });

  if (res.ok) {
    fetchProjects();
  }
};

// Reset Form
const resetForm = () => {
  formTitle.textContent = "Add New Project";
  projectIdField.value = "";
  projectForm.reset();
  submitBtn.textContent = "Save Project";
};

cancelBtn.addEventListener("click", resetForm);

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("adminToken");
  window.location.href = "admin.html";
});

// Initial Fetch
fetchProjects();

// --------------------------
// Subscribers Handling + Socket.IO + Badge
// --------------------------
const NEWSLETTER_API = getApiUrl('api/newsletter');
const subscribersList = document.getElementById("subscribersList");
const subBadge = document.getElementById("subBadge");

const updateBadge = (count) => {
  if (!subBadge) return;
  subBadge.textContent = count || "0";
  subBadge.style.display = count > 0 ? "inline-block" : "none";
};

const addSubscriberToUI = (s, highlight = true) => {
  if (!subscribersList) return;
  const tr = document.createElement("tr");
  tr.id = `sub-${s._id || s.id}`;
  const unreadClass = s.read ? "" : "font-weight-bold";
  tr.innerHTML = `
        <td class="${unreadClass}">${s.email}</td>
        <td>${new Date(s.subscribedAt).toLocaleString()}</td>
        <td class="actions">
            <button class="btn" onclick="toggleSubRead('${
              s._id || s.id
            }')" title="Toggle Read"><i class="fas fa-eye"></i></button>
            <button class="btn btn-danger" onclick="unsubscribe('${
              s.email
            }')" title="Unsubscribe"><i class="fas fa-user-times"></i></button>
        </td>
    `;
  // insert at top
  if (subscribersList.firstChild)
    subscribersList.insertBefore(tr, subscribersList.firstChild);
  else subscribersList.appendChild(tr);

  if (highlight) {
    tr.classList.add("new-row");
    setTimeout(() => tr.classList.remove("new-row"), 2000);
  }
};

const fetchSubscribers = async () => {
  try {
    const res = await fetch(`${NEWSLETTER_API}/subscribers`, {
      headers: { "x-auth-token": token },
    });
    if (!res.ok) return;
    const payload = await res.json();
    const subscribers =
      payload && payload.data && payload.data.subscribers
        ? payload.data.subscribers
        : [];

    // render list
    if (!subscribersList) return;
    subscribersList.innerHTML = "";
    subscribers.forEach((s) => addSubscriberToUI(s, false));

    // update badge with unread count
    const unread = subscribers.filter((s) => !s.read).length;
    updateBadge(unread);
  } catch (err) {
    console.error("Error fetching subscribers:", err);
  }
};

window.unsubscribe = async (email) => {
  if (!confirm("Unsubscribe this email?")) return;
  try {
    const res = await fetch(`${NEWSLETTER_API}/unsubscribe`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      fetchSubscribers();
      alert("Unsubscribed.");
    } else {
      const data = await res.json();
      alert(
        "Unsubscribe failed: " + (data.message || data.msg || "Unknown error")
      );
    }
  } catch (err) {
    console.error(err);
    alert("Network error");
  }
};

window.toggleSubRead = async (id) => {
  try {
    const res = await fetch(`${NEWSLETTER_API}/subscribers/${id}/read`, {
      method: "PUT",
      headers: { "x-auth-token": token },
    });
    if (res.ok) {
      // optimistic: update UI
      fetchSubscribers();
    } else {
      console.error("Failed toggling read");
    }
  } catch (err) {
    console.error(err);
  }
};

// Section switcher (projects / messages / subscribers)
const showSection = (section, el) => {
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));
  if (el) el.classList.add("active");
  document.getElementById("projectsSection").style.display =
    section === "projects" ? "" : "none";
  document.getElementById("messagesSection").style.display =
    section === "messages" ? "" : "none";
  document.getElementById("subscribersSection").style.display =
    section === "subscribers" ? "" : "none";
  if (section === "subscribers") fetchSubscribers();
  if (section === "messages") fetchMessages();
};

// --------------------------
// Contact / Messages Handling
// --------------------------
const CONTACT_API = getApiUrl('api/contact');
const messagesList = document.getElementById("messagesList");
const replyModal = document.getElementById("replyModal");
const replyForm = document.getElementById("replyForm");
const replyIdField = document.getElementById("replyId");
const replyEmailField = document.getElementById("replyEmail");
const replySubject = document.getElementById("replySubject");
const replyMessageField = document.getElementById("replyMessage");

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString();
  } catch (e) {
    return iso;
  }
};

const addMessageToUI = (m, highlight = true) => {
  if (!messagesList) return;
  const tr = document.createElement("tr");
  tr.id = `msg-${m._id}`;
  const readIcon = m.read
    ? '<i class="fas fa-envelope-open"></i>'
    : '<i class="fas fa-envelope"></i>';
  const toggleBtnIcon = m.read
    ? '<i class="fas fa-eye-slash"></i>'
    : '<i class="fas fa-eye"></i>';
  const safeMessage = (m.message || "").replace(/\n/g, " ");
  tr.innerHTML = `
      <td>${readIcon}</td>
      <td>${m.name}</td>
      <td>${m.email}</td>
      <td style="max-width:400px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${safeMessage}">${safeMessage}</td>
      <td>${formatDate(m.createdAt)}</td>
      <td class="actions">
        <button class="btn" onclick="toggleRead('${
          m._id
        }')" title="Toggle Read">${toggleBtnIcon}</button>
        <button class="btn btn-primary" onclick="openReply('${m._id}','${(
    m.email || ""
  ).replace(
    /'\n/g,
    "\\'"
  )}')" title="Reply"><i class="fas fa-reply"></i></button>
        <button class="btn btn-danger" onclick="deleteMessage('${
          m._id
        }')" title="Delete"><i class="fas fa-trash"></i></button>
      </td>
  `;
  // insert at top
  if (messagesList.firstChild)
    messagesList.insertBefore(tr, messagesList.firstChild);
  else messagesList.appendChild(tr);
  if (highlight) {
    tr.classList.add("new-row");
    setTimeout(() => tr.classList.remove("new-row"), 2000);
  }
};

const fetchMessages = async () => {
  if (!token) return;
  try {
    const res = await fetch(CONTACT_API, {
      headers: { "x-auth-token": token },
    });
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "admin.html";
      }
      return;
    }
    const messages = await res.json();
    renderMessages(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
  }
};

const renderMessages = (messages) => {
  if (!messagesList) return;
  messagesList.innerHTML = "";
  messages.forEach((m) => addMessageToUI(m, false));
};

window.toggleRead = async (id) => {
  try {
    const res = await fetch(`${CONTACT_API}/${id}/read`, {
      method: "PUT",
      headers: { "x-auth-token": token },
    });
    if (res.ok) await fetchMessages();
  } catch (err) {
    console.error(err);
  }
};

window.deleteMessage = async (id) => {
  if (!confirm("Delete this message?")) return;
  try {
    const res = await fetch(`${CONTACT_API}/${id}`, {
      method: "DELETE",
      headers: { "x-auth-token": token },
    });
    if (res.ok) await fetchMessages();
  } catch (err) {
    console.error(err);
  }
};

window.openReply = (id, email) => {
  replyIdField.value = id;
  replyEmailField.value = email;
  replyModal.showModal();
};

replyForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = replyIdField.value;
  const email = replyEmailField.value;
  const payload = {
    id,
    email,
    subject: replySubject.value,
    replyMessage: replyMessageField.value,
  };
  try {
    const res = await fetch(`${CONTACT_API}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-auth-token": token },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      replyModal.close();
      replyForm.reset();
      await fetchMessages();
      alert("Reply sent.");
    } else {
      const data = await res.json();
      alert("Reply failed: " + (data.msg || "Unknown error"));
    }
  } catch (err) {
    console.error(err);
    alert("Network error");
  }
});

// Socket.IO client (realtime subscriber pushes)
let socket;
try {
  socket = io(getSocketUrl() || 'http://localhost:5000');
  socket.on("newsletter:new", (sub) => {
    // Add to UI and update badge
    addSubscriberToUI(sub, true);
    const current = parseInt(subBadge.textContent || "0", 10) || 0;
    updateBadge(current + (sub.read ? 0 : 1));
  });

  socket.on("contact:new", (msg) => {
    if (!msg) return;
    // Add to messages UI and highlight
    addMessageToUI(msg, true);
  });
} catch (e) {
  console.warn("Socket.IO client failed to connect:", e.message);
}

// Start polling subscribers as a fallback so new subscriptions appear in dashboard
fetchSubscribers();
setInterval(fetchSubscribers, 5000);

// Start polling messages as a fallback so new messages appear if socket fails
fetchMessages();
setInterval(fetchMessages, 5000);
