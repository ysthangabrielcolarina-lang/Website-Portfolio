/* ============================================================
   PAGE ROUTING
============================================================ */
function showPage(page) {
  const target = document.getElementById(page);
  if (target) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    target.classList.add("active");
  }
}

/* ============================================================
   TOAST NOTIFICATION
============================================================ */
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.className = "toast " + type;
  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => toast.classList.remove("show"), 2500);
}

/* ============================================================
   FIELD ERROR HELPERS
============================================================ */
function showFieldError(fieldId, message) {
  clearFieldError(fieldId);
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.style.borderColor = "#dc2626";
  field.style.boxShadow   = "0 0 0 3px rgba(220,38,38,0.1)";
  const err = document.createElement("div");
  err.className = "field-error";
  err.id = fieldId + "_error";
  err.textContent = message;
  field.closest(".input-wrap").insertAdjacentElement("afterend", err);
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (field) { field.style.borderColor = ""; field.style.boxShadow = ""; }
  const existing = document.getElementById(fieldId + "_error");
  if (existing) existing.remove();
}

function clearAllErrors() {
  document.querySelectorAll(".field-error").forEach(e => e.remove());
  document.querySelectorAll("input").forEach(i => {
    i.style.borderColor = "";
    i.style.boxShadow   = "";
  });
}

/* ============================================================
   INPUT VALIDATORS
============================================================ */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function isValidStudentID(id) {
  // Accepts: any 4-digit year followed by hyphen and 3-6 digits, or plain 5–10 digits
  return /^\d{4}-\d{3,6}$/.test(id) || /^\d{5,10}$/.test(id);
}

function isValidPassword(pass) { return pass.length >= 12; }
function hasUppercase(pass)    { return /[A-Z]/.test(pass); }
function hasNumber(pass)       { return /[0-9]/.test(pass); }

/* ============================================================
   PASSWORD STRENGTH INDICATOR
============================================================ */
function updatePasswordStrength(password) {
  const bar   = document.getElementById("strengthBar");
  const label = document.getElementById("strengthLabel");
  if (!bar || !label) return;

  let score = 0;
  if (password.length >= 12)  score++;
  if (hasUppercase(password)) score++;
  if (hasNumber(password))    score++;
  if (password.length >= 16)  score++;

  const levels = [
    { label: "",        color: "#e5e7eb", width: "0%"   },
    { label: "Weak",    color: "#dc2626", width: "25%"  },
    { label: "Fair",    color: "#d97706", width: "50%"  },
    { label: "Good",    color: "#0b4da2", width: "75%"  },
    { label: "Strong",  color: "#059669", width: "100%" },
  ];

  const level = levels[score] || levels[0];
  bar.style.width      = level.width;
  bar.style.background = level.color;
  label.textContent    = level.label;
  label.style.color    = level.color;
}

/* ============================================================
   PASSWORD TOGGLE
============================================================ */
function togglePassword(id, btn) {
  const input    = document.getElementById(id);
  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";
  btn.style.opacity = isHidden ? "1" : "0.4";
  btn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
}

/* ============================================================
   UTILITY
============================================================ */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

function genId(prefix) {
  return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ============================================================
   STUDENT SESSION (localStorage)
============================================================ */
function setStudentSession(name, initials, email, studentID, grade, contact) {
  localStorage.setItem("sg_studentName",     name);
  localStorage.setItem("sg_studentInitials", initials);
  localStorage.setItem("sg_studentEmail",    email     || "");
  localStorage.setItem("sg_studentID",       studentID || "");
  localStorage.setItem("sg_studentGrade",    grade     || "Grade 11 — STEM");
  localStorage.setItem("sg_studentContact",  contact   || "");
  localStorage.setItem("sg_loggedIn",        "true");
}

function getStudentSession() {
  return {
    name:     localStorage.getItem("sg_studentName")     || "Student",
    initials: localStorage.getItem("sg_studentInitials") || "ST",
    email:    localStorage.getItem("sg_studentEmail")    || "",
    id:       localStorage.getItem("sg_studentID")       || "",
    grade:    localStorage.getItem("sg_studentGrade")    || "Grade 11 — STEM",
    contact:  localStorage.getItem("sg_studentContact")  || "",
    loggedIn: localStorage.getItem("sg_loggedIn") === "true"
  };
}

function clearStudentSession() {
  ["sg_studentName","sg_studentInitials","sg_studentEmail","sg_studentID",
    "sg_studentGrade","sg_studentContact","sg_loggedIn"]
    .forEach(k => localStorage.removeItem(k));
}

function loadStudentSession() {
  const s = getStudentSession();
  ["studentName","sidebarName"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = s.name;
  });
  ["studentAvatar","sidebarAvatar"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = s.initials;
  });
  const gradeEl = document.getElementById("sidebarGrade");
  if (gradeEl) gradeEl.textContent = s.grade;
}

/* ============================================================
   PROFILE MODAL
============================================================ */
function openProfileModal() {
  const s = getStudentSession();
  document.getElementById("profileFullName").value    = s.name;
  document.getElementById("profileStudentID").value   = s.id;
  document.getElementById("profileEmail").value       = s.email;
  document.getElementById("profileGrade").value       = s.grade;
  document.getElementById("profileContact").value     = s.contact;
  document.getElementById("profileNewPassword").value = "";
  document.getElementById("profileConfirmPassword").value = "";

  document.getElementById("modalAvatar").textContent     = s.initials;
  document.getElementById("modalAvatarName").textContent = s.name;

  document.getElementById("profileModal").style.display = "flex";
  document.getElementById("profileFullName").focus();
}

function closeProfileModal() {
  document.getElementById("profileModal").style.display = "none";
  // Clear any field errors inside modal
  document.querySelectorAll("#profileModal .field-error").forEach(e => e.remove());
  document.querySelectorAll("#profileModal input").forEach(i => {
    i.style.borderColor = "";
    i.style.boxShadow   = "";
  });
}

function saveProfile() {
  const fullname  = document.getElementById("profileFullName").value.trim();
  const studentID = document.getElementById("profileStudentID").value.trim();
  const email     = document.getElementById("profileEmail").value.trim();
  const grade     = document.getElementById("profileGrade").value.trim();
  const contact   = document.getElementById("profileContact").value.trim();
  const newPass   = document.getElementById("profileNewPassword").value;
  const confPass  = document.getElementById("profileConfirmPassword").value;

  // Clear previous errors
  ["profileFullName","profileStudentID","profileEmail","profileNewPassword","profileConfirmPassword"]
    .forEach(clearFieldError);

  let hasError = false;

  if (!fullname || fullname.length < 2) {
    showFieldError("profileFullName", "Enter your full name");
    hasError = true;
  }
  if (studentID && !isValidStudentID(studentID)) {
    showFieldError("profileStudentID", "Format: YYYY-00123 or a plain 5–10 digit number");
    hasError = true;
  }
  if (email && !isValidEmail(email)) {
    showFieldError("profileEmail", "Invalid email format — example: juan@stgabriel.edu.ph");
    hasError = true;
  }

  // Password change is optional — only validate if filled
  if (newPass || confPass) {
    if (!isValidPassword(newPass)) {
      showFieldError("profileNewPassword", "Password must be at least 12 characters");
      hasError = true;
    }
    if (newPass !== confPass) {
      showFieldError("profileConfirmPassword", "Passwords do not match");
      hasError = true;
    }
  }

  if (hasError) return;

  // Derive initials
  const nameParts = fullname.split(" ");
  const initials  = (nameParts[0][0] + (nameParts[1] ? nameParts[1][0] : nameParts[0][1] || "")).toUpperCase();

  // Update session
  setStudentSession(fullname, initials, email, studentID, grade || "Grade 11 — STEM", contact);

  // If password was changed, update in user DB
  if (newPass) {
    const users = getUsers();
    const sess  = getStudentSession();
    const idx   = users.findIndex(u =>
      u.email.toLowerCase() === sess.email.toLowerCase() ||
      u.studentID.toLowerCase() === sess.id.toLowerCase()
    );
    if (idx !== -1) {
      users[idx].password = newPass;
      saveUsers(users);
    }
  }

  loadStudentSession();
  closeProfileModal();
  showToast("Profile updated successfully!");
}

// Close modal when clicking backdrop
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("profileModal");
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeProfileModal();
    });
  }
});

/* ============================================================
   FAKE USER DATABASE (localStorage)
============================================================ */
function getUsers() {
  try { return JSON.parse(localStorage.getItem("sg_users") || "[]"); }
  catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem("sg_users", JSON.stringify(users));
}

function findUser(emailOrID) {
  const query = emailOrID.toLowerCase();
  return getUsers().find(u =>
    u.email.toLowerCase() === query ||
    u.studentID.toLowerCase() === query
  ) || null;
}

function userExists(email, studentID) {
  return getUsers().some(u =>
    u.email.toLowerCase()     === email.toLowerCase() ||
    u.studentID.toLowerCase() === studentID.toLowerCase()
  );
}

/* ============================================================
   AUTHENTICATION — LOGIN
============================================================ */
function login() {
  clearAllErrors();

  const emailOrID = document.getElementById("loginEmail").value.trim();
  const pass      = document.getElementById("loginPassword").value;
  let   hasError  = false;

  if (!emailOrID) {
    showFieldError("loginEmail", "Email or Student ID is required");
    hasError = true;
  }
  if (!pass) {
    showFieldError("loginPassword", "Password is required");
    hasError = true;
  }
  if (hasError) return;

  const user = findUser(emailOrID);
  if (!user) {
    showFieldError("loginEmail", "No account found with that email or Student ID");
    showToast("Account not found", "error");
    return;
  }
  if (user.password !== pass) {
    showFieldError("loginPassword", "Incorrect password");
    showToast("Incorrect password", "error");
    return;
  }

  setStudentSession(user.displayName, user.initials, user.email, user.studentID,
    user.grade || "Grade 11 — STEM", user.contact || "");
  loadStudentSession();
  showToast("Welcome back, " + user.displayName + "!");
  setTimeout(() => showPage("dashboardPage"), 800);
}

/* ============================================================
   AUTHENTICATION — REGISTER
============================================================ */
function registerUser() {
  clearAllErrors();

  const fullname  = document.getElementById("fullname").value.trim();
  const studentID = document.getElementById("studentID").value.trim();
  const email     = document.getElementById("email").value.trim();
  const pass      = document.getElementById("password").value;
  const confirm   = document.getElementById("confirmPassword").value;
  let   hasError  = false;

  if (!fullname || fullname.length < 2) {
    showFieldError("fullname", "Enter your full name");
    hasError = true;
  }
  if (!studentID) {
    showFieldError("studentID", "Student ID is required");
    hasError = true;
  } else if (!isValidStudentID(studentID)) {
    showFieldError("studentID", "Use format YYYY-00123 (any 4-digit year) or a plain 5–10 digit number");
    hasError = true;
  }
  if (!email) {
    showFieldError("email", "Email address is required");
    hasError = true;
  } else if (!email.includes("@")) {
    showFieldError("email", 'Missing "@" — a valid email looks like: juan@stgabriel.edu.ph');
    hasError = true;
  } else if (!isValidEmail(email)) {
    showFieldError("email", "Invalid email format — example: juan@stgabriel.edu.ph");
    hasError = true;
  }
  if (!pass) {
    showFieldError("password", "Password is required");
    hasError = true;
  } else if (!isValidPassword(pass)) {
    showFieldError("password", "Password must be at least 12 characters");
    hasError = true;
  }
  if (!confirm) {
    showFieldError("confirmPassword", "Please confirm your password");
    hasError = true;
  } else if (pass !== confirm) {
    showFieldError("confirmPassword", "Passwords do not match");
    hasError = true;
  }
  if (hasError) return;

  if (userExists(email, studentID)) {
    showFieldError("email", "An account with this email or Student ID already exists");
    showToast("Account already exists", "error");
    return;
  }

  const nameParts   = fullname.split(" ");
  const displayName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
  const initials    = (nameParts[0][0] + (nameParts[1] ? nameParts[1][0] : nameParts[0][1] || "")).toUpperCase();

  const users = getUsers();
  users.push({ fullname, displayName, initials, studentID, email, password: pass,
    grade: "Grade 11 — STEM", contact: "" });
  saveUsers(users);

  ["fullname","studentID","email","password","confirmPassword"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  showToast("Account created! You can now sign in.");
  setTimeout(() => showPage("loginPage"), 1200);
}

/* ============================================================
   AUTHENTICATION — FORGOT / RESET PASSWORD
============================================================ */
function resetPassword() {
  clearAllErrors();

  const emailOrID = document.getElementById("forgotInput").value.trim();
  const newPass   = document.getElementById("newPassword").value;
  const confirm   = document.getElementById("confirmNewPassword").value;
  let   hasError  = false;

  if (!emailOrID) {
    showFieldError("forgotInput", "Email or Student ID is required");
    hasError = true;
  }
  if (!newPass) {
    showFieldError("newPassword", "New password is required");
    hasError = true;
  } else if (!isValidPassword(newPass)) {
    showFieldError("newPassword", "Password must be at least 12 characters");
    hasError = true;
  }
  if (!confirm) {
    showFieldError("confirmNewPassword", "Please confirm your new password");
    hasError = true;
  } else if (newPass !== confirm) {
    showFieldError("confirmNewPassword", "Passwords do not match");
    hasError = true;
  }
  if (hasError) return;

  const users = getUsers();
  const query = emailOrID.toLowerCase();
  const index = users.findIndex(u =>
    u.email.toLowerCase()     === query ||
    u.studentID.toLowerCase() === query
  );

  if (index === -1) {
    showFieldError("forgotInput", "No account found with that email or Student ID");
    showToast("Account not found", "error");
    return;
  }

  users[index].password = newPass;
  saveUsers(users);

  ["forgotInput","newPassword","confirmNewPassword"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  showToast("Password updated! You can now sign in.");
  setTimeout(() => showPage("loginPage"), 1200);
}

/* ============================================================
   DATA MODEL — Tasks, Schedule, Todos, Subjects
============================================================ */
const TASKS_KEY    = "sg_tasks";
const SCHEDULE_KEY = "sg_schedule";
const TODOS_KEY    = "sg_todos";

const DEFAULT_TASKS = [
  { id: "t1", title: "Programming Project",  subject: "Programming",  due: "Jun 18", pct: 80 },
  { id: "t2", title: "Research Paper",       subject: "Science",      due: "Jun 22", pct: 60 },
  { id: "t3", title: "Math Activity Sheet",  subject: "Mathematics",  due: "Jun 25", pct: 40 }
];

const DEFAULT_SCHEDULE = [
  { id: "s1", time: "8:00 AM",  subject: "Mathematics",     room: "Room 201" },
  { id: "s2", time: "9:00 AM",  subject: "Filipino",        room: "Room 202" },
  { id: "s3", time: "10:00 AM", subject: "Programming",     room: "Lab 3"    },
  { id: "s4", time: "11:00 AM", subject: "Physical Education", room: "Gym"  },
  { id: "s5", time: "1:00 PM",  subject: "Science",         room: "Room 105" },
  { id: "s6", time: "2:00 PM",  subject: "English",         room: "Room 110" },
  { id: "s7", time: "3:00 PM",  subject: "Social Studies",  room: "Room 108" },
  { id: "s8", time: "4:00 PM",  subject: "Values Education",room: "Room 103" }
];

// 8 subjects with teachers
const SUBJECTS = [
  { name: "Mathematics",      track: "Grade 11 — STEM",  teacher: "Mr. Santos"    },
  { name: "Programming",      track: "Grade 11 — STEM",  teacher: "Ms. Reyes"     },
  { name: "Science",          track: "Grade 11 — STEM",  teacher: "Mr. Garcia"    },
  { name: "English",          track: "Grade 11 — Core",  teacher: "Ms. Cruz"      },
  { name: "Filipino",         track: "Grade 11 — Core",  teacher: "Mrs. Mendoza"  },
  { name: "Social Studies",   track: "Grade 11 — Core",  teacher: "Mr. Villanueva"},
  { name: "Physical Education",track:"Grade 11 — Core",  teacher: "Coach Rivera"  },
  { name: "Values Education", track: "Grade 11 — Core",  teacher: "Mrs. Dela Rosa"}
];

const SUBJECT_DETAILS = {
  Mathematics: [
    { name: "Quiz 1 — Functions",   score: 18, max: 20 },
    { name: "Quiz 2 — Derivatives", score: 19, max: 20 },
    { name: "Long Exam 1",          score: 46, max: 50 },
    { name: "Problem Set 3",        score: 9,  max: 10 }
  ],
  Programming: [
    { name: "Lab Exercise 1",   score: 20, max: 20 },
    { name: "Lab Exercise 2",   score: 18, max: 20 },
    { name: "Midterm Project",  score: 47, max: 50 },
    { name: "Code Review Quiz", score: 9,  max: 10 }
  ],
  Science: [
    { name: "Quiz 1 — Cell Biology", score: 17, max: 20 },
    { name: "Lab Report 1",          score: 18, max: 20 },
    { name: "Long Exam 1",           score: 44, max: 50 },
    { name: "Research Paper Draft",  score: 9,  max: 10 }
  ],
  English: [
    { name: "Reading Comprehension Quiz", score: 17, max: 20 },
    { name: "Essay 1",                    score: 17, max: 20 },
    { name: "Long Exam 1",                score: 43, max: 50 },
    { name: "Oral Recitation",            score: 9,  max: 10 }
  ],
  Filipino: [
    { name: "Pagsusulit 1",      score: 18, max: 20 },
    { name: "Sanaysay 1",        score: 16, max: 20 },
    { name: "Long Exam 1",       score: 42, max: 50 },
    { name: "Talumpati",         score: 9,  max: 10 }
  ],
  "Social Studies": [
    { name: "Quiz 1 — History",   score: 17, max: 20 },
    { name: "Map Activity",       score: 18, max: 20 },
    { name: "Long Exam 1",        score: 43, max: 50 },
    { name: "Report Presentation",score: 9,  max: 10 }
  ],
  "Physical Education": [
    { name: "Fitness Test 1",   score: 19, max: 20 },
    { name: "Skills Demo 1",    score: 18, max: 20 },
    { name: "Written Exam 1",   score: 44, max: 50 },
    { name: "Sports Portfolio", score: 9,  max: 10 }
  ],
  "Values Education": [
    { name: "Reflection Paper 1", score: 18, max: 20 },
    { name: "Group Activity 1",   score: 19, max: 20 },
    { name: "Long Exam 1",        score: 45, max: 50 },
    { name: "Journal Entry",      score: 10, max: 10 }
  ]
};

function loadTasks() {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_TASKS));
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : JSON.parse(JSON.stringify(DEFAULT_TASKS));
  } catch { return JSON.parse(JSON.stringify(DEFAULT_TASKS)); }
}

function saveTasks() { localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)); }

function loadSchedule() {
  try {
    const raw = localStorage.getItem(SCHEDULE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));
  } catch { return JSON.parse(JSON.stringify(DEFAULT_SCHEDULE)); }
}

function saveSchedule() { localStorage.setItem(SCHEDULE_KEY, JSON.stringify(scheduleItems)); }

function loadTodos() {
  try {
    const raw = localStorage.getItem(TODOS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function saveTodos() { localStorage.setItem(TODOS_KEY, JSON.stringify(todos)); }

let tasks         = loadTasks();
let scheduleItems = loadSchedule();
let todos         = loadTodos();
let taskQuery     = "";
let subjectQuery  = "";
let selectedSubject = null;

/* ============================================================
   TO-DO WIDGET
============================================================ */
function addTodo(event) {
  if (event) event.preventDefault();
  const inputEl = document.getElementById("newTodoText");
  if (!inputEl) return;
  const text = inputEl.value.trim();
  if (!text) return;
  todos.unshift({ id: genId("td"), text, done: false });
  saveTodos();
  inputEl.value = "";
  renderHomeTodos();
}

function toggleTodoDone(id) {
  const t = todos.find(x => x.id === id);
  if (!t) return;
  t.done = !t.done;
  saveTodos();
  renderHomeTodos();
}

function deleteTodo(id) {
  todos = todos.filter(x => x.id !== id);
  saveTodos();
  renderHomeTodos();
}

function renderHomeTodos() {
  const container = document.getElementById("homeTodoList");
  if (!container) return;

  if (todos.length === 0) {
    container.innerHTML = `<div class="empty-state">Nothing on your list yet — add a personal reminder above.</div>`;
    return;
  }

  const sorted = [...todos].sort((a, b) => Number(a.done) - Number(b.done));
  container.innerHTML = sorted.map(t => `
    <div class="todo-item${t.done ? " is-done" : ""}">
      <input type="checkbox" class="task-checkbox" ${t.done ? "checked" : ""}
        aria-label="Mark '${escapeHtml(t.text)}' as ${t.done ? "not done" : "done"}"
        onchange="toggleTodoDone('${t.id}')">
      <span class="todo-text">${escapeHtml(t.text)}</span>
      <button class="btn-delete" type="button" aria-label="Delete to-do"
        onclick="deleteTodo('${t.id}')">✕</button>
    </div>`).join("");
}

/* ============================================================
   ASSIGNMENTS — checkable, progress slider, editable deadline, add/delete
============================================================ */
function isTaskDone(t)  { return Number(t.pct) >= 100; }

function barColor(pct) {
  return pct >= 100 ? "#059669" : pct >= 50 ? "#d97706" : "#dc2626";
}

function toggleTaskDone(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  if (isTaskDone(t)) {
    t.pct = (typeof t.prevPct === "number") ? t.prevPct : 0;
  } else {
    t.prevPct = t.pct;
    t.pct = 100;
  }
  saveTasks();
  refreshAssignmentUI();
}

function updateTaskProgress(id, pct) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  t.pct = Math.max(0, Math.min(100, Number(pct)));
  saveTasks();
  refreshAssignmentUI();
}

function updateTaskDue(id, newDue) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  const clean = newDue.trim();
  if (clean) t.due = clean;
  saveTasks();
  refreshAssignmentUI();
}

function deleteTask(id) {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  if (!confirm('Delete "' + t.title + '"?')) return;
  tasks = tasks.filter(x => x.id !== id);
  saveTasks();
  showToast("Assignment deleted");
  refreshAssignmentUI();
}

function addTask(event) {
  if (event) event.preventDefault();

  const titleEl   = document.getElementById("newTaskTitle");
  const subjectEl = document.getElementById("newTaskSubject");
  const dueEl     = document.getElementById("newTaskDue");
  const pctEl     = document.getElementById("newTaskPct");
  if (!titleEl) return;

  const title = titleEl.value.trim();
  if (!title) { showToast("Please enter an assignment title", "error"); return; }

  tasks.push({
    id: genId("t"),
    title,
    subject: subjectEl.value,
    due: dueEl.value.trim() || "No due date",
    pct: Math.max(0, Math.min(100, Number(pctEl.value) || 0))
  });

  saveTasks();
  showToast("Assignment added");
  titleEl.value = "";
  dueEl.value   = "";
  pctEl.value   = 0;
  refreshAssignmentUI();
}

function filterTasks(list, query) {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(t =>
    t.title.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q)
  );
}

function taskRowHtml(t, withControls) {
  const done   = isTaskDone(t);
  const color  = barColor(t.pct);
  const dotCls = done ? "dot-done" : "dot-pending";
  const pctCls = done ? "done" : "pending";

  const checkbox = `
    <input type="checkbox" class="task-checkbox" ${done ? "checked" : ""}
      aria-label="Mark ${escapeHtml(t.title)} as ${done ? "not done" : "done"}"
      onchange="toggleTaskDone('${t.id}')">`;

  // Editable deadline shown in full assignments view
  const dueDisplay = withControls
    ? `<span class="editable-field assign-due-edit" contenteditable="true" spellcheck="false"
         title="Click to edit deadline"
         aria-label="Deadline for ${escapeHtml(t.title)}"
         onblur="updateTaskDue('${t.id}', this.textContent)"
         onkeydown="if(event.key==='Enter'){event.preventDefault();this.blur();}"
       >${escapeHtml(t.due)}</span>`
    : `Due: ${escapeHtml(t.due)} · ${escapeHtml(t.subject)}`;

  const slider = withControls ? `
    <input type="range" class="task-slider" min="0" max="100" value="${t.pct}"
      aria-label="${escapeHtml(t.title)} progress"
      oninput="this.nextElementSibling.textContent = this.value + '%'"
      onchange="updateTaskProgress('${t.id}', this.value)">
    <span class="task-slider-val">${t.pct}%</span>` : "";

  const deleteBtn = withControls ? `
    <button class="btn-delete" type="button" aria-label="Delete ${escapeHtml(t.title)}"
      onclick="deleteTask('${t.id}')">✕</button>` : "";

  if (withControls) {
    return `
      <div class="assign-item${done ? " is-done" : ""}">
        ${checkbox}
        <div class="assign-dot ${dotCls}" aria-hidden="true"></div>
        <div class="assign-info">
          <div class="assign-title">${escapeHtml(t.title)}</div>
          <div class="assign-due assign-due-row">
            <span class="assign-due-label">📅 Due:</span>
            ${dueDisplay}
            <span class="assign-due-subject"> · ${escapeHtml(t.subject)}</span>
          </div>
        </div>
        <div class="assign-controls">${slider}</div>
        ${deleteBtn}
      </div>`;
  }

  return `
    <div class="assign-item${done ? " is-done" : ""}">
      ${checkbox}
      <div class="assign-dot ${dotCls}" aria-hidden="true"></div>
      <div class="assign-info">
        <div class="assign-title">${escapeHtml(t.title)}</div>
        <div class="assign-due">${dueDisplay}</div>
      </div>
      <div class="assign-bar">
        <div class="bar" style="width:120px;" role="progressbar" aria-valuenow="${t.pct}" aria-valuemin="0" aria-valuemax="100">
          <div class="bar-fill" style="width:${t.pct}%;background:${color};"></div>
        </div>
      </div>
      <div class="assign-pct ${pctCls}">${t.pct}%</div>
    </div>`;
}

function renderHomeAssignments() {
  const container = document.getElementById("homeAssignList");
  if (!container) return;

  if (tasks.length === 0) {
    container.innerHTML = `<div class="empty-state">No assignments yet. Add one from the Assignments tab.</div>`;
    return;
  }

  const sorted = [...tasks].sort((a, b) => Number(isTaskDone(a)) - Number(isTaskDone(b)));
  container.innerHTML = sorted.slice(0, 4).map(t => taskRowHtml(t, false)).join("");
}

function updatePendingStat() {
  const el = document.getElementById("statPendingTasks");
  if (!el) return;
  const pending = tasks.filter(t => !isTaskDone(t)).length;
  el.textContent = pending;
  el.setAttribute("aria-label", pending + " pending tasks");
}

function refreshAssignmentUI() {
  renderHomeAssignments();
  updatePendingStat();
  if (currentSection === "tasks") rerenderSection();
}

function renderTasksSection() {
  const subjectOptions = SUBJECTS.map(s =>
    `<option value="${escapeHtml(s.name)}">${escapeHtml(s.name)}</option>`).join("");
  const filtered = filterTasks(tasks, taskQuery);

  const listHtml = filtered.length
    ? filtered.map(t => taskRowHtml(t, true)).join("")
    : `<div class="empty-state">No assignments match "${escapeHtml(taskQuery)}".</div>`;

  return `
    <div class="search-wrap">
      <span class="search-icon" aria-hidden="true">🔍</span>
      <input type="text" class="search-input" id="taskSearchInput"
        placeholder="Search by title or subject…" value="${escapeHtml(taskQuery)}"
        aria-label="Search assignments"
        oninput="taskQuery = this.value; rerenderSection();">
    </div>

    <div class="section-detail-card">
      <div class="card-title" style="margin-bottom:4px;">Your Assignments</div>
      <div class="field-hint" style="margin-bottom:14px;">Click a deadline to edit it directly.</div>
      <div id="taskListWrap">${listHtml}</div>
    </div>

    <div class="section-detail-card">
      <div class="card-title" style="margin-bottom:14px;">➕ Add New Assignment</div>
      <form class="add-form" onsubmit="addTask(event)">
        <div class="form-field">
          <label for="newTaskTitle">Title <span class="required">*</span></label>
          <input type="text" id="newTaskTitle" placeholder="e.g. Lab Report 2" required>
        </div>
        <div class="form-field">
          <label for="newTaskSubject">Subject</label>
          <select id="newTaskSubject">${subjectOptions}</select>
        </div>
        <div class="form-field">
          <label for="newTaskDue">Due Date</label>
          <input type="text" id="newTaskDue" placeholder="e.g. Jun 30">
          <div class="field-hint">Free text — e.g. "Jun 30" or "Next Friday"</div>
        </div>
        <div class="form-field">
          <label for="newTaskPct">Starting Progress</label>
          <input type="number" id="newTaskPct" placeholder="0" min="0" max="100" value="0">
          <div class="field-hint">Number from 0–100 (%)</div>
        </div>
        <button class="btn-primary add-form-btn" type="submit">Add Assignment</button>
      </form>
    </div>`;
}

/* ============================================================
   SCHEDULE — inline-editable, add/delete
============================================================ */
function deleteScheduleItem(id) {
  const item = scheduleItems.find(x => x.id === id);
  if (!item) return;
  if (!confirm('Remove "' + item.subject + '" from the schedule?')) return;
  scheduleItems = scheduleItems.filter(x => x.id !== id);
  saveSchedule();
  showToast("Schedule entry removed");
  rerenderSection();
}

function updateScheduleField(id, field, value) {
  const item = scheduleItems.find(x => x.id === id);
  if (!item) return;
  const clean = value.trim();
  item[field] = clean || item[field];
  saveSchedule();
}

function addScheduleItem(event) {
  if (event) event.preventDefault();

  const timeEl    = document.getElementById("newSchedTime");
  const subjectEl = document.getElementById("newSchedSubject");
  const roomEl    = document.getElementById("newSchedRoom");
  if (!timeEl) return;

  const time    = timeEl.value.trim();
  const subject = subjectEl.value.trim();
  if (!time || !subject) { showToast("Please enter a time and subject", "error"); return; }

  scheduleItems.push({ id: genId("s"), time, subject, room: roomEl.value.trim() || "TBA" });
  saveSchedule();
  showToast("Schedule entry added");

  timeEl.value    = "";
  subjectEl.value = "";
  roomEl.value    = "";
  rerenderSection();
}

function scheduleRowHtml(item) {
  return `
    <div class="detail-row schedule-row">
      <span class="editable-field" contenteditable="true" spellcheck="false"
        aria-label="Time" onblur="updateScheduleField('${item.id}','time',this.textContent)">${escapeHtml(item.time)}</span>
      <span> — </span>
      <span class="editable-field schedule-subject" contenteditable="true" spellcheck="false"
        aria-label="Subject" onblur="updateScheduleField('${item.id}','subject',this.textContent)">${escapeHtml(item.subject)}</span>
      <span class="schedule-room-wrap">
        <span class="editable-field" contenteditable="true" spellcheck="false"
          aria-label="Room" onblur="updateScheduleField('${item.id}','room',this.textContent)">${escapeHtml(item.room)}</span>
        <button class="btn-delete" type="button" aria-label="Delete schedule entry for ${escapeHtml(item.subject)}"
          onclick="deleteScheduleItem('${item.id}')">✕</button>
      </span>
    </div>`;
}

function renderScheduleSection() {
  const listHtml = scheduleItems.length
    ? scheduleItems.map(scheduleRowHtml).join("")
    : `<div class="empty-state">No classes scheduled yet.</div>`;

  return `
    <div class="section-detail-card">
      <div class="field-hint" style="margin-bottom:12px;">Click any time, subject, or room to edit it directly.</div>
      <div id="scheduleListWrap">${listHtml}</div>
    </div>

    <div class="section-detail-card">
      <div class="card-title" style="margin-bottom:14px;">➕ Add Class</div>
      <form class="add-form" onsubmit="addScheduleItem(event)">
        <div class="form-field">
          <label for="newSchedTime">Time <span class="required">*</span></label>
          <input type="text" id="newSchedTime" placeholder="e.g. 9:00 AM" required>
        </div>
        <div class="form-field">
          <label for="newSchedSubject">Subject <span class="required">*</span></label>
          <input type="text" id="newSchedSubject" placeholder="e.g. Physical Education" required>
        </div>
        <div class="form-field">
          <label for="newSchedRoom">Room</label>
          <input type="text" id="newSchedRoom" placeholder="e.g. Room 204">
          <div class="field-hint">Leave blank to mark as "TBA"</div>
        </div>
        <button class="btn-primary add-form-btn" type="submit">Add to Schedule</button>
      </form>
    </div>`;
}

/* ============================================================
   SUBJECTS — searchable + drill-down (8 subjects with teacher)
============================================================ */
function gradeLetterFor(pct) {
  if (pct >= 95) return { label: "A",  color: "#065f46", bg: "#d1fae5" };
  if (pct >= 90) return { label: "A-", color: "#065f46", bg: "#d1fae5" };
  if (pct >= 87) return { label: "B+", color: "#1e40af", bg: "#dbeafe" };
  if (pct >= 83) return { label: "B",  color: "#1e40af", bg: "#dbeafe" };
  if (pct >= 80) return { label: "B-", color: "#92400e", bg: "#fef3c7" };
  return           { label: "C",  color: "#92400e", bg: "#fef3c7" };
}

function openSubjectDetail(name) {
  selectedSubject = name;
  rerenderSection();
}

function closeSubjectDetail() {
  selectedSubject = null;
  rerenderSection();
}

function renderSubjectsSection() {
  if (selectedSubject) return renderSubjectDetail(selectedSubject);

  const q = subjectQuery.trim().toLowerCase();
  const filtered = q
    ? SUBJECTS.filter(s => s.name.toLowerCase().includes(q))
    : SUBJECTS;

  const listHtml = filtered.length
    ? filtered.map(s => {
      const acts       = SUBJECT_DETAILS[s.name] || [];
      const totalScore = acts.reduce((sum, a) => sum + a.score, 0);
      const totalMax   = acts.reduce((sum, a) => sum + a.max,   0);
      const pct        = totalMax ? Math.round((totalScore / totalMax) * 1000) / 10 : 0;
      const grade      = gradeLetterFor(pct);
      return `
        <div class="detail-row subject-row" role="button" tabindex="0"
          onclick="openSubjectDetail('${escapeHtml(s.name)}')"
          onkeydown="if(event.key==='Enter')openSubjectDetail('${escapeHtml(s.name)}')"
          aria-label="View breakdown for ${escapeHtml(s.name)}">
          <span>
            ${escapeHtml(s.name)}
            <span class="subject-track">${escapeHtml(s.track)}</span>
            <span class="subject-teacher">👤 ${escapeHtml(s.teacher)}</span>
          </span>
          <span class="subject-row-right">
            <span class="grade-badge" style="background:${grade.bg};color:${grade.color};">${grade.label}</span>
            <span class="subject-chevron" aria-hidden="true">›</span>
          </span>
        </div>`;
    }).join("")
    : `<div class="empty-state">No subjects match "${escapeHtml(subjectQuery)}".</div>`;

  return `
    <div class="search-wrap">
      <span class="search-icon" aria-hidden="true">🔍</span>
      <input type="text" class="search-input" id="subjectSearchInput"
        placeholder="Search subjects by name…" value="${escapeHtml(subjectQuery)}"
        aria-label="Search subjects"
        oninput="subjectQuery = this.value; rerenderSection();">
    </div>
    <div class="section-detail-card">${listHtml}</div>`;
}

function renderSubjectDetail(name) {
  const subj       = SUBJECTS.find(s => s.name === name) || { teacher: "—", track: "—" };
  const acts       = SUBJECT_DETAILS[name] || [];
  const totalScore = acts.reduce((sum, a) => sum + a.score, 0);
  const totalMax   = acts.reduce((sum, a) => sum + a.max,   0);
  const pct        = totalMax ? Math.round((totalScore / totalMax) * 1000) / 10 : 0;
  const grade      = gradeLetterFor(pct);

  const rows = acts.length
    ? acts.map(a => {
      const apct = Math.round((a.score / a.max) * 100);
      return `
        <div class="detail-row">
          ${escapeHtml(a.name)}
          <span>${a.score}/${a.max} <span class="activity-pct">(${apct}%)</span></span>
        </div>`;
    }).join("")
    : `<div class="empty-state">No recorded activities for this subject yet.</div>`;

  return `
    <button class="back-btn subject-back-btn" type="button" onclick="closeSubjectDetail()">← Back to Subjects</button>
    <div class="section-detail-card">
      <div class="subject-detail-head">
        <div>
          <div class="card-title" style="margin-bottom:2px;">${escapeHtml(name)}</div>
          <div class="subject-detail-meta">
            <span class="field-hint">👤 ${escapeHtml(subj.teacher)}</span>
            <span class="field-hint"> · ${escapeHtml(subj.track)}</span>
          </div>
          <div class="field-hint" style="margin-top:4px;">Breakdown of quizzes, activities, and exams</div>
        </div>
        <div class="grade-badge subject-detail-badge" style="background:${grade.bg};color:${grade.color};">${grade.label}</div>
      </div>
    </div>
    <div class="section-detail-card">${rows}</div>
    <div class="section-detail-card">
      <div class="overall-box" style="margin:0;">
        <div class="overall-label">Running Average</div>
        <div class="overall-val">${pct}</div>
      </div>
    </div>`;
}

/* ============================================================
   GRADES SECTION
============================================================ */
function renderGradesSection() {
  return `
    <div class="section-detail-card">
      <div class="detail-row">Mathematics       <span style="color:#059669;font-weight:700;">95 — A</span></div>
      <div class="detail-row">Programming       <span style="color:#059669;font-weight:700;">93 — A</span></div>
      <div class="detail-row">Science           <span style="color:#0b4da2;font-weight:700;">90 — B+</span></div>
      <div class="detail-row">English           <span style="color:#0b4da2;font-weight:700;">88 — B+</span></div>
      <div class="detail-row">Filipino          <span style="color:#0b4da2;font-weight:700;">87 — B+</span></div>
      <div class="detail-row">Social Studies    <span style="color:#0b4da2;font-weight:700;">86 — B</span></div>
      <div class="detail-row">Physical Education<span style="color:#059669;font-weight:700;">92 — A-</span></div>
      <div class="detail-row">Values Education  <span style="color:#059669;font-weight:700;">95 — A</span></div>
    </div>
    <div class="section-detail-card">
      <div class="overall-box" style="margin:0;">
        <div class="overall-label">General Weighted Average</div>
        <div class="overall-val">90.8</div>
      </div>
    </div>`;
}

/* ============================================================
   DASHBOARD NAVIGATION
============================================================ */
let currentSection = null;

const SECTION_LABELS = {
  subjects: "📚 Subjects",
  tasks:    "📝 Assignments",
  schedule: "📅 Class Schedule",
  grades:   "📊 Grade Report"
};

const SECTION_RENDERERS = {
  subjects: renderSubjectsSection,
  tasks:    renderTasksSection,
  schedule: renderScheduleSection,
  grades:   renderGradesSection
};

function rerenderSection() {
  if (!currentSection) return;
  const sectionData   = document.getElementById("sectionData");
  const focusedSearch = document.activeElement && document.activeElement.id;
  sectionData.innerHTML = SECTION_RENDERERS[currentSection]();

  if (focusedSearch === "taskSearchInput" || focusedSearch === "subjectSearchInput") {
    const el = document.getElementById(focusedSearch);
    if (el) { el.focus(); el.selectionStart = el.selectionEnd = el.value.length; }
  }
}

function openSection(type) {
  if (!SECTION_RENDERERS[type]) return;

  document.getElementById("homeContent").style.display    = "none";
  document.getElementById("sectionContent").style.display = "block";

  currentSection  = type;
  selectedSubject = null;

  document.querySelectorAll(".nav-link").forEach(l => {
    l.classList.remove("active");
    l.removeAttribute("aria-current");
    if (l.dataset.section === type) {
      l.classList.add("active");
      l.setAttribute("aria-current", "page");
    }
  });

  document.getElementById("sectionTitle").textContent    = SECTION_LABELS[type];
  document.getElementById("sectionData").innerHTML       = SECTION_RENDERERS[type]();
  document.getElementById("sectionContent").focus();
}

function home() {
  currentSection = null;

  document.getElementById("homeContent").style.display    = "block";
  document.getElementById("sectionContent").style.display = "none";

  document.querySelectorAll(".nav-link").forEach(l => {
    const isHome = l.dataset.section === "home";
    l.classList.toggle("active", isHome);
    if (isHome) l.setAttribute("aria-current", "page");
    else l.removeAttribute("aria-current");
  });

  renderHomeAssignments();
  updatePendingStat();
  renderHomeTodos();
}

function logout() {
  showToast("Logged out successfully");
  clearStudentSession();
  const inputs = document.querySelectorAll("input");
  inputs.forEach(input => input.value = "");
  setTimeout(() => showPage("loginPage"), 800);
}

/* ============================================================
   ON PAGE LOAD
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  loadStudentSession();
  renderHomeAssignments();
  updatePendingStat();
  renderHomeTodos();

  // Live password strength on register form
  const passInput = document.getElementById("password");
  if (passInput) {
    passInput.addEventListener("input", () => updatePasswordStrength(passInput.value));
  }

  // Live email format hint while typing
  const emailInput = document.getElementById("email");
  if (emailInput) {
    emailInput.addEventListener("input", () => {
      const val = emailInput.value.trim();
      clearFieldError("email");
      if (val.length > 3 && !val.includes("@")) {
        showFieldError("email", 'Missing "@" — email should look like: juan@stgabriel.edu.ph');
      } else if (val.includes("@") && !isValidEmail(val) && val.length > 5) {
        showFieldError("email", "Incomplete email — example: juan@stgabriel.edu.ph");
      }
    });
  }

  // Live Student ID format hint while typing
  const idInput = document.getElementById("studentID");
  if (idInput) {
    idInput.addEventListener("input", () => {
      const val = idInput.value.trim();
      clearFieldError("studentID");
      if (val.length > 0 && !isValidStudentID(val)) {
        showFieldError("studentID", "Format: YYYY-00123 (any year) or a 5–10 digit number");
      }
    });
    idInput.addEventListener("blur", () => {
      const val = idInput.value.trim();
      if (val && !isValidStudentID(val)) {
        showFieldError("studentID", "Use format YYYY-00123 or a plain 5–10 digit number");
      }
    });
  }

  // Clear field error as the user starts correcting their input
  document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
      if (input.id !== "email" && input.id !== "studentID") {
        clearFieldError(input.id);
      }
    });
  });

  // Enter key to submit forms
  document.getElementById("loginPassword")
    ?.addEventListener("keydown", e => { if (e.key === "Enter") login(); });
  document.getElementById("confirmPassword")
    ?.addEventListener("keydown", e => { if (e.key === "Enter") registerUser(); });
  document.getElementById("confirmNewPassword")
    ?.addEventListener("keydown", e => { if (e.key === "Enter") resetPassword(); });

  // Profile modal — live name preview
  const profileNameInput = document.getElementById("profileFullName");
  if (profileNameInput) {
    profileNameInput.addEventListener("input", () => {
      const val = profileNameInput.value.trim();
      if (!val) return;
      const parts    = val.split(" ");
      const initials = (parts[0][0] + (parts[1] ? parts[1][0] : parts[0][1] || "")).toUpperCase();
      const avatarEl = document.getElementById("modalAvatar");
      const nameEl   = document.getElementById("modalAvatarName");
      if (avatarEl) avatarEl.textContent = initials;
      if (nameEl)   nameEl.textContent   = val;
    });
  }

  // Profile modal — close with Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      const modal = document.getElementById("profileModal");
      if (modal && modal.style.display !== "none") closeProfileModal();
    }
  });
});
