const API_BASE = "https://phi-lab-server.vercel.app/api/v1/lab";
const DEMO_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

const state = {
  issues: [],
  filter: "all",
  searchQuery: "",
};

const loginScreen = document.getElementById("loginScreen");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const tabs = document.getElementById("tabs");
const issuesGrid = document.getElementById("issuesGrid");
const loadingSpinner = document.getElementById("loadingSpinner");
const emptyState = document.getElementById("emptyState");
const issueCount = document.getElementById("issueCount");
const summaryCopy = document.getElementById("summaryCopy");
const issueModal = document.getElementById("issueModal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalCloseAction = document.getElementById("modalCloseAction");

const DEFAULT_EMPTY_STATE = emptyState.innerHTML;
const NO_DESCRIPTION = "No description available.";
const PILL_RULES = [
  { className: "pill-red", keywords: ["high", "critical", "urgent", "bug"] },
  { className: "pill-yellow", keywords: ["help", "wanted", "question", "support"] },
  { className: "pill-orange", keywords: ["medium", "warning", "docs", "documentation"] },
  { className: "pill-green", keywords: ["low", "enhancement", "success"] },
  { className: "pill-purple", keywords: ["feature", "ui", "design", "refactor"] },
];

function normalizeStatus(issue) {
  const status = (issue.status || issue.state || "").toString().toLowerCase();
  return status === "closed" ? "closed" : "open";
}

function formatDate(dateString) {
  if (!dateString) return "N/A";

  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) return dateString;

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function truncateText(text, limit) {
  if (!text) return NO_DESCRIPTION;
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trim()}...`;
}

function getIssueId(issue) {
  return issue.id || issue._id || issue.issueId || issue.number || "";
}

function getField(issue, keys, fallback = "N/A") {
  for (const key of keys) {
    if (issue[key] !== undefined && issue[key] !== null && issue[key] !== "") {
      return issue[key];
    }
  }
  return fallback;
}

function getPillClass(value) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return "pill-gray";
  const text = raw.toString().toLowerCase();

  for (const rule of PILL_RULES) {
    if (rule.keywords.some((key) => text.includes(key))) {
      return rule.className;
    }
  }

  return "pill-gray";
}

function getLabelList(labelValue) {
  if (Array.isArray(labelValue)) return labelValue;
  if (!labelValue) return [];
  if (typeof labelValue === "string") {
    return labelValue
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [labelValue];
}

function setLoading(isLoading) {
  loadingSpinner.classList.toggle("hidden", !isLoading);
  if (isLoading) {
    emptyState.classList.add("hidden");
    issuesGrid.innerHTML = "";
  }
}

function updateSummary(items) {
  issueCount.textContent = items.length;

  if (state.searchQuery) {
    summaryCopy.textContent = `Results for "${state.searchQuery}" in the ${state.filter} issues view.`;
    return;
  }

  if (state.filter === "open") {
    summaryCopy.textContent = "Showing only open issues that still need attention.";
    return;
  }

  if (state.filter === "closed") {
    summaryCopy.textContent = "Showing closed issues that have already been resolved.";
    return;
  }

  summaryCopy.textContent = "Track and manage your project issues.";
}

function renderIssues() {
  emptyState.innerHTML = DEFAULT_EMPTY_STATE;

  const items = state.issues.filter((issue) => {
    if (state.filter === "all") return true;
    return normalizeStatus(issue) === state.filter;
  });

  updateSummary(items);
  issuesGrid.innerHTML = "";
  emptyState.classList.toggle("hidden", items.length > 0);

  if (!items.length) return;

  const fragment = document.createDocumentFragment();

  items.forEach((issue) => {
    const card = document.createElement("article");
    const status = normalizeStatus(issue);
    const statusIcon =
      status === "open" ? "./assets/Open-Status.png" : "./assets/Closed- Status .png";
    const title = getField(issue, ["title", "name"]);
    const description = getField(issue, ["description", "body"], NO_DESCRIPTION);
    const author = getField(issue, ["author", "createdBy", "user"]);
    const priority = getField(issue, ["priority"]);
    const label = getField(issue, ["labels", "label"]);
    const createdAt = formatDate(getField(issue, ["createdAt", "created_at", "date"], ""));
    const issueId = getIssueId(issue);
    const priorityClass = getPillClass(priority);
    const labels = getLabelList(label).slice(0, 2);

    card.className = `issue-card ${status}`;
    card.innerHTML = `
      <div class="issue-top">
        <img class="status-icon" src="${statusIcon}" alt="${status} status" />
        <span class="pill ${priorityClass}">${priority}</span>
      </div>
      <h3 class="issue-title">${title}</h3>
      <p class="issue-description">${truncateText(description, 96)}</p>
      <div class="issue-pills">
        ${labels
          .map(
            (item) => `<span class="pill pill-label ${getPillClass(item)}">${item}</span>`
          )
          .join("")}
      </div>
      <div class="issue-divider"></div>
      <div class="issue-footer">
        <span>${issueId ? `#${issueId}` : "N/A"} by ${author}</span>
        <span>${createdAt}</span>
      </div>
    `;

    card.addEventListener("click", () => openIssueModal(issue));
    fragment.appendChild(card);
  });

  issuesGrid.appendChild(fragment);
}

function openIssueModal(issue) {
  const status = normalizeStatus(issue);
  const labelValue = getField(issue, ["labels", "label"]);
  const author = getField(issue, ["author", "createdBy", "user"]);
  const createdAt = formatDate(getField(issue, ["createdAt", "created_at", "date"], ""));
  const assigneeRaw = getField(issue, ["assignee", "assignedTo", "assignees"], "Unassigned");
  const assignee = Array.isArray(assigneeRaw) ? assigneeRaw.join(", ") : assigneeRaw;
  const priority = getField(issue, ["priority"]);
  const labels = getLabelList(labelValue);

  modalTitle.textContent = getField(issue, ["title", "name"]);
  modalBody.innerHTML = `
    <div class="modal-meta">
      <span class="pill ${status === "open" ? "pill-green" : "pill-purple"}">
        ${status === "open" ? "Opened" : "Closed"}
      </span>
      <span class="modal-meta-text">Opened by ${author}</span>
      <span class="modal-meta-text">${createdAt}</span>
    </div>
    <div class="modal-tags">
      ${labels
        .map(
          (item) => `<span class="pill pill-label ${getPillClass(item)}">${item}</span>`
        )
        .join("")}
    </div>
    <p class="modal-desc">${getField(issue, ["description", "body"], NO_DESCRIPTION)}</p>
    <div class="modal-info">
      <div class="modal-info-item">
        <label>Assignee:</label>
        <strong>${assignee}</strong>
      </div>
      <div class="modal-info-item">
        <label>Priority:</label>
        <span class="pill ${getPillClass(priority)}">${priority}</span>
      </div>
    </div>
  `;

  issueModal.showModal();
}

async function fetchIssues(url) {
  setLoading(true);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch issues.");
    }

    const data = await response.json();
    state.issues = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    renderIssues();
  } catch (error) {
    state.issues = [];
    issuesGrid.innerHTML = "";
    emptyState.classList.remove("hidden");
    emptyState.innerHTML = `
      <h3>Unable to load issues</h3>
      <p>${error.message}</p>
    `;
  } finally {
    setLoading(false);
  }
}

function loadIssues() {
  const endpoint = state.searchQuery
    ? `${API_BASE}/issues/search?q=${encodeURIComponent(state.searchQuery)}`
    : `${API_BASE}/issues`;

  fetchIssues(endpoint);
}

function setActiveTab(nextFilter) {
  state.filter = nextFilter;
  document.querySelectorAll(".tab-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === nextFilter);
  });
  renderIssues();
}

function showDashboard() {
  loginScreen.classList.add("hidden");
  dashboard.classList.remove("hidden");
  loadIssues();
}

function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (
    username === DEMO_CREDENTIALS.username &&
    password === DEMO_CREDENTIALS.password
  ) {
    loginError.textContent = "";
    localStorage.setItem("issueTrackerAuth", "true");
    showDashboard();
    return;
  }

  loginError.textContent = "Invalid username or password.";
}

function initializeAuth() {
  if (localStorage.getItem("issueTrackerAuth") === "true") {
    showDashboard();
  }
}

loginForm.addEventListener("submit", handleLogin);

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.searchQuery = searchInput.value.trim();
  loadIssues();
});

tabs.addEventListener("click", (event) => {
  const button = event.target.closest(".tab-btn");
  if (!button) return;
  setActiveTab(button.dataset.filter);
});

modalCloseAction.addEventListener("click", () => issueModal.close());

issueModal.addEventListener("click", (event) => {
  const dialogDimensions = issueModal.getBoundingClientRect();
  const isInDialog =
    dialogDimensions.top <= event.clientY &&
    event.clientY <= dialogDimensions.top + dialogDimensions.height &&
    dialogDimensions.left <= event.clientX &&
    event.clientX <= dialogDimensions.left + dialogDimensions.width;

  if (!isInDialog) {
    issueModal.close();
  }
});

initializeAuth();
