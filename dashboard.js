// ===============================
// HR DASHBOARD CORE VARIABLES
// ===============================
let employees = [];
let applications = [];
let meetings = [];
let trainings = JSON.parse(localStorage.getItem("trainings")) || [];
let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];


// ===============================
// INITIALIZATION
// ===============================
window.onload = function () {
  const user = localStorage.getItem("loggedInUser");

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("welcomeUser").innerHTML = getGreetingMessage(user);

  if (!localStorage.getItem("employees")) preloadData();
  loadData();
  updateDashboard();
  renderTraining();
  renderFeedbacks();

  startMeetingReminderSystem();
  loadProfile();
  updateClock();
  setInterval(updateClock, 1000);
};


// ===============================
// GREETING MESSAGE
// ===============================
function getGreetingMessage(user) {
  const h = new Date().getHours();
  let greet = h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening";

  const name = user.includes("@") ? user.split("@")[0] : user;
  const pretty = name.charAt(0).toUpperCase() + name.slice(1);

  return `👋 ${greet}, <span style="color:#0078d7">${pretty}</span>`;
}


// ===============================
// PRELOAD SAMPLE DATA
// ===============================
function preloadData() {
  employees = [
  { name: "Rajesh Kumar", department: "IT", gender: "Male", monthly_income: 8500, years_at_company: 6, attrition: "No", job_satisfaction: 4 },
  { name: "Priya Sharma", department: "HR", gender: "Female", monthly_income: 6500, years_at_company: 3, attrition: "Yes", job_satisfaction: 3 },
  { name: "Rohan Das", department: "Sales", gender: "Male", monthly_income: 7200, years_at_company: 4, attrition: "No", job_satisfaction: 4 },
  { name: "Simran Kaur", department: "Marketing", gender: "Female", monthly_income: 7100, years_at_company: 4, attrition: "No", job_satisfaction: 4 },
  { name: "Amit Verma", department: "Finance", gender: "Male", monthly_income: 9000, years_at_company: 5, attrition: "No", job_satisfaction: 5 },
  { name: "Divya Nair", department: "IT", gender: "Female", monthly_income: 7800, years_at_company: 2, attrition: "No", job_satisfaction: 4 },
  { name: "Suresh Patil", department: "Operations", gender: "Male", monthly_income: 6600, years_at_company: 3, attrition: "No", job_satisfaction: 3 },
  { name: "Neha Singh", department: "Marketing", gender: "Female", monthly_income: 7400, years_at_company: 4, attrition: "No", job_satisfaction: 5 },
  { name: "Vikas Yadav", department: "Sales", gender: "Male", monthly_income: 8200, years_at_company: 6, attrition: "No", job_satisfaction: 4 },
  { name: "Megha Iyer", department: "HR", gender: "Female", monthly_income: 6900, years_at_company: 1, attrition: "No", job_satisfaction: 3 },
  { name: "Arun Jadhav", department: "IT", gender: "Male", monthly_income: 9600, years_at_company: 2, attrition: "No", job_satisfaction: 4 },
  { name: "Sneha Chatur", department: "Finance", gender: "Female", monthly_income: 9100, years_at_company: 5, attrition: "No", job_satisfaction: 5 },
  { name: "Imran Syed", department: "Operations", gender: "Male", monthly_income: 4400, years_at_company: 1, attrition: "No", job_satisfaction: 3 },
  { name: "Tanya Aggarwal", department: "Marketing", gender: "Female", monthly_income: 7300, years_at_company: 3, attrition: "No", job_satisfaction: 4 }
];


  applications = [
  { name: "Karan Patel", email: "karan@gmail.com", department: "IT", salary: 6000, gender: "Male", status: "Pending" },
  { name: "Sneha Kapoor", email: "sneha@gmail.com", department: "Sales", salary: 5500, gender: "Female", status: "Pending" },
  { name: "Harshit Sharma", email: "harshit@gmail.com", department: "Finance", salary: 5800, gender: "Male", status: "Pending" },
  { name: "Aditi Mehra", email: "aditi@gmail.com", department: "HR", salary: 5200, gender: "Female", status: "Pending" },
  { name: "Rishi Malhotra", email: "rishi@gmail.com", department: "IT", salary: 6200, gender: "Male", status: "Pending" },
  { name: "Pooja Rane", email: "pooja@gmail.com", department: "Operations", salary: 5100, gender: "Female", status: "Pending" },
  { name: "Mahesh Chauhan", email: "mahesh@gmail.com", department: "Marketing", salary: 5700, gender: "Male", status: "Pending" },
  { name: "Deepa Joshi", email: "deepa@gmail.com", department: "Sales", salary: 5400, gender: "Female", status: "Pending" },
  { name: "Gaurav Tiwari", email: "gaurav@gmail.com", department: "Finance", salary: 6000, gender: "Male", status: "Pending" },
  { name: "Laxmi Rao", email: "laxmi@gmail.com", department: "IT", salary: 5900, gender: "Female", status: "Pending" },
  { name: "Nitin Batra", email: "nitin@gmail.com", department: "Operations", salary: 5300, gender: "Male", status: "Pending" },
  { name: "Shweta Koli", email: "shweta@gmail.com", department: "Marketing", salary: 5600, gender: "Female", status: "Pending" }
];


  meetings = [
    { name: "Priya Sharma", topic: "Exit Interview", date: "2025-11-15", time: "15:30" },
    { name: "Karan Patel", topic: "Onboarding", date: "2025-11-17", time: "16:00" }
  ];

  localStorage.setItem("employees", JSON.stringify(employees));
  localStorage.setItem("applications", JSON.stringify(applications));
  localStorage.setItem("meetings", JSON.stringify(meetings));

  if (!localStorage.getItem("trainings")) {
    const defaultTrainings = [
      { title: "Leadership Skills", trainer: "Ananya Jain", date: "2025-11-10", status: "Ongoing" },
      { title: "Cybersecurity Awareness", trainer: "Rajesh Kumar", date: "2025-11-09", status: "Ongoing" },
      { title: "Sales Strategy 2025", trainer: "Rohan Das", date: "2025-11-11", status: "Ongoing" }
    ];
    localStorage.setItem("trainings", JSON.stringify(defaultTrainings));
  }

  if (!localStorage.getItem("feedbacks")) {

  const defaultFeedbacks = [
    { name: "Rajesh Kumar", text: "Excellent leadership and project delivery.", date: "2025-11-01" },
    { name: "Priya Sharma", text: "HR processes are more refined this month.", date: "2025-11-02" },
    { name: "Rohan Das", text: "Sales team achieved quarterly targets successfully.", date: "2025-11-03" },
    { name: "Simran Kaur", text: "Marketing campaigns performed really well.", date: "2025-11-04" },
    { name: "Ananya Jain", text: "Amazing collaboration across departments.", date: "2025-11-05" },
    { name: "Ravi Mehta", text: "Finance process automation worked flawlessly.", date: "2025-11-06" },
    { name: "Aditya Rao", text: "System upgrade handled without downtime.", date: "2025-11-07" },
    { name: "Sneha Kapoor", text: "Candidate onboarding experience was smooth.", date: "2025-11-08" },
    { name: "Karan Patel", text: "Training quality has improved significantly.", date: "2025-11-09" },
    { name: "Divya Nair", text: "Employee engagement improved this week.", date: "2025-11-10" },
    { name: "Manoj Verma", text: "Timely reporting helped management decisions.", date: "2025-11-11" },
    { name: "Suresh Rao", text: "Productivity increased in IT support team.", date: "2025-11-12" },
    { name: "Meena Singh", text: "Creative ideas boosted marketing conversions.", date: "2025-11-13" },
    { name: "Tarun Mehta", text: "Great customer interaction and problem solving.", date: "2025-11-14" },
    { name: "Harshita Gupta", text: "Recruitment process optimized successfully.", date: "2025-11-15" },
    { name: "Vikram Joshi", text: "Great effort in handling urgent tech issues.", date: "2025-11-16" },
    { name: "Nikita Shah", text: "Team collaboration has improved drastically.", date: "2025-11-17" },
    { name: "Deepak Yadav", text: "Timely completion of monthly reports.", date: "2025-11-18" },
    { name: "Shruti Pandey", text: "Great communication with stakeholders.", date: "2025-11-19" },
    { name: "Aman Tiwari", text: "Consistent dedication to project deadlines.", date: "2025-11-20" },
    { name: "Neha Singh", text: "HR initiatives boosted employee morale.", date: "2025-11-21" },
    { name: "Arjun Patel", text: "Outstanding performance in sales lead conversion.", date: "2025-11-22" },
    { name: "Riya Kapoor", text: "Quality of documentation improved a lot.", date: "2025-11-23" },
    { name: "Mohit Verma", text: "Great contribution in inter-team coordination.", date: "2025-11-24" },
    { name: "Krishna Nair", text: "Excellent teamwork during peak workload.", date: "2025-11-25" }
  ];

  localStorage.setItem("feedbacks", JSON.stringify(defaultFeedbacks));
}

}


// ===============================
// LOAD FROM LOCAL STORAGE
// ===============================
function loadData() {
  employees = JSON.parse(localStorage.getItem("employees")) || [];
  applications = JSON.parse(localStorage.getItem("applications")) || [];
  meetings = JSON.parse(localStorage.getItem("meetings")) || [];
  trainings = JSON.parse(localStorage.getItem("trainings")) || [];
  feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

  renderApplications();
  renderMeetings();
}


// ===============================
// ADD EMPLOYEE
// ===============================
function addEmployee() {
  const name = getVal("name");
  const dept = getVal("department");
  const gender = getVal("gender");
  const income = parseInt(getVal("monthly_income"));

  if (!name || !dept) return alert("Enter all required fields");

  employees.push({
    name,
    department: dept,
    gender,
    monthly_income: income,
    years_at_company: 0,
    attrition: "No",
    job_satisfaction: 3
  });

  saveAll();
  updateDashboard();
  showNotification(`✅ Employee ${name} added`);
}


// ===============================
// DASHBOARD CALCULATIONS
// ===============================
function updateDashboard() {
  const t = employees.length || 1;

  const totalIncome = employees.reduce((a, b) => a + b.monthly_income, 0);
  const avg = (totalIncome / t).toFixed(0);

  const attrition = (
    (employees.filter(x => x.attrition.toLowerCase() === "yes").length / t) * 100
  ).toFixed(1);

  const satisfaction = (
    employees.reduce((a, b) => a + b.job_satisfaction, 0) / t
  ).toFixed(1);

  document.getElementById("totalEmployees").textContent = t;
  document.getElementById("avgSalary").textContent = `₹${avg}`;
  document.getElementById("attritionRate").textContent = `${attrition}%`;
  document.getElementById("satisfactionRate").textContent = satisfaction;

  renderCharts();
}


// ===============================
// DASHBOARD CHARTS
// ===============================
let deptChartObj, genderChartObj, salaryChartObj, satisfactionChartObj;

function renderCharts() {
  if (deptChartObj) deptChartObj.destroy();
  if (genderChartObj) genderChartObj.destroy();
  if (salaryChartObj) salaryChartObj.destroy();
  if (satisfactionChartObj) satisfactionChartObj.destroy();

  // Employees by Department
  const dept = {};
  employees.forEach(e => dept[e.department] = (dept[e.department] || 0) + 1);

  deptChartObj = new Chart(document.getElementById("deptChart"), {
    type: "bar",
    data: {
      labels: Object.keys(dept),
      datasets: [{ data: Object.values(dept), backgroundColor: "#007bff" }]
    }
  });

  // Gender Pie Chart
  const g = { Male: 0, Female: 0 };
  employees.forEach(e => g[e.gender] = (g[e.gender] || 0) + 1);

  genderChartObj = new Chart(document.getElementById("genderChart"), {
    type: "pie",
    data: {
      labels: ["Male", "Female"],
      datasets: [{ data: [g.Male, g.Female], backgroundColor: ["#36A2EB", "#FF6384"] }]
    }
  });

  // Salary by Department
  const sal = {};
  employees.forEach(e => {
    if (!sal[e.department]) sal[e.department] = [];
    sal[e.department].push(e.monthly_income);
  });

  const avgSal = Object.keys(sal).map(d =>
    sal[d].reduce((a, b) => a + b, 0) / sal[d].length
  );

  salaryChartObj = new Chart(document.getElementById("salaryChart"), {
    type: "bar",
    data: {
      labels: Object.keys(sal),
      datasets: [{ data: avgSal, backgroundColor: "#00c897" }]
    }
  });

  // Satisfaction Trend
  satisfactionChartObj = new Chart(document.getElementById("satisfactionChart"), {
    type: "line",
    data: {
      labels: employees.map(e => e.name),
      datasets: [{
        data: employees.map(e => e.job_satisfaction),
        borderColor: "#ffb74d",
        tension: 0.3
      }]
    }
  });
}


// ===============================
// APPLICATIONS TAB
// ===============================
function renderApplications() {
  const tbl = document.getElementById("applicationsTable");
  tbl.innerHTML = `
    <tr>
      <th>Name</th><th>Email</th><th>Department</th>
      <th>Salary</th><th>Status</th><th>Action</th>
    </tr>
  `;

  applications.forEach((a, i) => {
    tbl.innerHTML += `
      <tr>
        <td><a href="#" onclick="showApplicantResume(${i})">${a.name}</a></td>
        <td>${a.email}</td>
        <td>${a.department}</td>
        <td>₹${a.salary}</td>
        <td>${a.status}</td>
        <td>
          ${a.status === "Pending"
            ? `<button onclick="hire(${i})">Hire</button> 
               <button onclick="reject(${i})">Reject</button>`
            : "-"
          }
        </td>
      </tr>
    `;
  });
}

function hire(i) {
  const a = applications[i];
  a.status = "Hired";

  employees.push({
    name: a.name,
    department: a.department,
    gender: "N/A",
    monthly_income: a.salary,
    years_at_company: 0,
    attrition: "No",
    job_satisfaction: 3
  });

  meetings.push({
    name: a.name,
    topic: "Onboarding",
    date: new Date().toISOString().split("T")[0],
    time: "10:00"
  });

  saveAll();
  renderApplications();
  renderMeetings();
  updateDashboard();

  showNotification(`🎉 ${a.name} hired successfully!`);
}


function reject(i) {
  applications[i].status = "Rejected";
  saveAll();
  renderApplications();
  showNotification(`❌ ${applications[i].name}'s application rejected`);
}



// ===============================
// MEETINGS TAB — ADD / EDIT / DELETE
// ===============================
function addMeeting() {
  const name = getVal("meetName");
  const topic = getVal("meetTopic");
  const date = getVal("meetDate");
  const time = getVal("meetTime");
  const link = getVal("meetLink");

  if (!name || !topic || !date || !time) {
    alert("Fill all required fields");
    return;
  }

  meetings.push({ name, topic, date, time, link });
  saveAll();
  renderMeetings();
  showNotification("📅 Meeting Added");
}

function format12(t) {
  const [h, m] = t.split(":");
  const hour = (h % 12) || 12;
  const mer = h >= 12 ? "PM" : "AM";
  return `${hour}:${m} ${mer}`;
}

function getMeetingStatus(date, time) {
  const now = new Date();
  const meet = new Date(`${date}T${time}`);

  if (meet.toDateString() === now.toDateString()) return `<span class='meet-badge today'>Today</span>`;
  if (meet > now) return `<span class='meet-badge upcoming'>Upcoming</span>`;
  return `<span class='meet-badge completed'>Completed</span>`;
}

function renderMeetings() {
  const tbl = document.getElementById("meetingsTable");

  tbl.innerHTML = `
    <tr>
      <th>Employee</th><th>Topic</th><th>Date</th>
      <th>Time</th><th>Status</th><th>Actions</th>
    </tr>
  `;

  meetings.forEach((m, i) => {
    tbl.innerHTML += `
      <tr>
        <td>${m.name}</td>
        <td>${m.topic}</td>
        <td>${m.date}</td>
        <td>${format12(m.time)}</td>
        <td>${getMeetingStatus(m.date, m.time)}</td>
        <td>
          <button onclick="editMeeting(${i})">✏️</button>
          <button onclick="deleteMeeting(${i})">🗑️</button>
        </td>
      </tr>
    `;
  });
}

function editMeeting(i) {
  const m = meetings[i];

  document.getElementById("meetName").value = m.name;
  document.getElementById("meetTopic").value = m.topic;
  document.getElementById("meetDate").value = m.date;
  document.getElementById("meetTime").value = m.time;
  document.getElementById("meetLink").value = m.link || "";

  meetings.splice(i, 1);
  saveAll();
  renderMeetings();
}

function deleteMeeting(i) {
  if (confirm("Delete this meeting?")) {
    meetings.splice(i, 1);
    saveAll();
    renderMeetings();
  }
}



// ===============================
// MEETING REMINDER SYSTEM (15 min)
// ===============================
function startMeetingReminderSystem() {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  setInterval(checkMeetingReminders, 60000);
}

function checkMeetingReminders() {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  meetings.forEach(m => {
    const [h, min] = m.time.split(":").map(Number);
    const meetingMin = h * 60 + min;
    const diff = meetingMin - nowMinutes;

    if (diff > 0 && diff <= 15 && !m.notified) {
      showNotification(`⏰ ${m.topic} with ${m.name} starts in ${diff} min`);
      m.notified = true;
    }
  });

  saveAll();
}

// ===============================
// EMPLOYEE LIST TAB
// ===============================
function renderEmployeeList() {
  const tbl = document.getElementById("employeeListTable");
  if (!tbl) return;

  tbl.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Department</th>
      <th>Gender</th>
      <th>Income</th>
      <th>Years</th>
      <th>Satisfaction</th>
    </tr>
  `;

  employees.forEach((emp, i) => {
    tbl.innerHTML += `
      <tr>
        <td><a href="#" onclick="showResume(${i})">${emp.name}</a></td>
        <td>${emp.department}</td>
        <td>${emp.gender}</td>
        <td>₹${emp.monthly_income}</td>
        <td>${emp.years_at_company}</td>
        <td>${emp.job_satisfaction}</td>
      </tr>
    `;
  });
}


// ===============================
// RESUME MODAL (EMPLOYEE + APPLICANT)
// ===============================
function showResume(i) {
  const e = employees[i];
  openResume(e.name, e.department, "employee", e);
}

function showApplicantResume(i) {
  const a = applications[i];
  openResume(a.name, a.department, "applicant", a);
}

function openResume(name, dept, type, data) {
  const modal = document.getElementById("resumeModal");

  document.getElementById("resumeName").textContent = name;
  document.getElementById("resumeDept").textContent = dept;

  document.getElementById("resumeGender").textContent = data.gender || "N/A";
  document.getElementById("resumeEmail").textContent = data.email || `${name.toLowerCase()}@company.com`;

  document.getElementById("resumeIncome").textContent =
    data.monthly_income || data.salary || "-";

  document.getElementById("resumeYears").textContent = data.years_at_company || "-";
  document.getElementById("resumeSatisfaction").textContent = data.job_satisfaction || "-";
  document.getElementById("resumeAttrition").textContent = data.attrition || "N/A";

  const skills = ["Teamwork", "Leadership", "Excel", "Python", "Marketing", "Finance"];
  const random = skills.sort(() => 0.5 - Math.random()).slice(0, 3);
  document.getElementById("resumeSkills").innerHTML =
    random.map(s => `<span class="skill-tag">${s}</span>`).join("");

  const score = type === "employee"
    ? Math.min(100, (data.job_satisfaction * 20) + data.years_at_company)
    : Math.floor(Math.random() * 40) + 60;

  document.getElementById("resumeProgress").style.width = score + "%";

  document.getElementById("resumeDownloadBtn").onclick = function () {
    downloadUnifiedResume(name, data);
  };

  modal.classList.remove("hidden");
}

function closeResume() {
  document.getElementById("resumeModal").classList.add("hidden");
}

function downloadUnifiedResume(name, d) {
  const txt = `
Name: ${name}
Department: ${d.department}
Email: ${d.email || "N/A"}
Salary: ₹${d.salary || d.monthly_income}
Gender: ${d.gender || "N/A"}
Years at Company: ${d.years_at_company || "-"}
Satisfaction: ${d.job_satisfaction || "-"}
  `;

  const blob = new Blob([txt], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${name}_Resume.txt`;
  link.click();
}



// ===============================
// TRAINING TAB
// ===============================
function addTraining() {
  const title = getVal("trainingTitle");
  const trainer = getVal("trainerName");
  const date = getVal("trainingDate");

  if (!title || !trainer || !date) {
    alert("Fill all fields");
    return;
  }

  trainings.push({ title, trainer, date, status: "Ongoing" });
  saveAll();
  renderTraining();
}

function renderTraining() {
  const tbl = document.getElementById("trainingTable");
  tbl.innerHTML = `
    <tr><th>Title</th><th>Trainer</th><th>Date</th><th>Status</th></tr>
  `;

  trainings.forEach(t => {
    tbl.innerHTML += `
      <tr>
        <td>${t.title}</td>
        <td>${t.trainer}</td>
        <td>${new Date(t.date).toLocaleDateString()}</td>
        <td>${t.status}</td>
      </tr>
    `;
  });
}



// ===============================
// FEEDBACK TAB
// ===============================
function addFeedback() {
  const text = getVal("feedbackText");
  const user = localStorage.getItem("loggedInUser");

  if (!text) return alert("Write feedback");

  feedbacks.push({
    name: user.split("@")[0],
    text,
    date: new Date().toLocaleDateString()
  });

  saveAll();
  renderFeedbacks();
  document.getElementById("feedbackText").value = "";
}

function renderFeedbacks() {
  const list = document.getElementById("feedbackList");

  list.innerHTML = feedbacks.map(f => `
    <li>
      <b>${f.name}</b> <small>(${f.date})</small><br>
      ${f.text}
    </li>
  `).join("");
}



// ===============================
// PERFORMANCE TAB
// ===============================
function updatePerformanceChart() {
  renderPerformanceChart(document.getElementById("performancePeriod").value);
}

function renderPerformanceChart(period = "monthly") {
  const ctx = document.getElementById("performanceChart");
  if (window.performanceChartObj) window.performanceChartObj.destroy();

  const labels = employees.map(e => e.name);
  let data;

  if (period === "daily") {
    data = employees.map(() => Math.floor(Math.random() * 100));
  } else if (period === "monthly") {
    data = employees.map(e => e.job_satisfaction * 20 + Math.floor(Math.random() * 10));
  } else {
    data = employees.map(e => e.years_at_company * 10 + Math.floor(Math.random() * 20));
  }

  window.performanceChartObj = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets: [{ data, backgroundColor: "#0078d7" }] }
  });
}



// ===============================
// PROFILE + CLOCK
// ===============================
function updateClock() {
  document.getElementById("liveClock").textContent =
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function toggleProfileCard() {
  document.getElementById("profileCard").classList.toggle("hidden");
}

function updateProfileImage(e) {
  const f = e.target.files[0];
  if (!f) return;

  const r = new FileReader();
  r.onload = () => {
    localStorage.setItem("profileImage", r.result);
    document.getElementById("profileIcon").src = r.result;
    document.getElementById("resumeAvatar").src = r.result;
  };
  r.readAsDataURL(f);
}

function loadProfile() {
  const user = localStorage.getItem("loggedInUser");
  const p = JSON.parse(localStorage.getItem("userProfile") || "{}");

  document.getElementById("profileName").value = p.name || user.split("@")[0];
  document.getElementById("profileRole").value = p.role || "HR Manager";
  document.getElementById("profileEmail").value = user;

  const img = localStorage.getItem("profileImage");
  if (img) {
    document.getElementById("profileIcon").src = img;
    document.getElementById("resumeAvatar").src = img;
  }
}

function saveProfile() {
  const name = getVal("profileName");
  const role = getVal("profileRole");
  const email = getVal("profileEmail");

  const p = { name, role, email };
  localStorage.setItem("userProfile", JSON.stringify(p));

  showNotification("Profile Updated");
  toggleProfileCard();
}



// ===============================
// UTILITY
// ===============================
function saveAll() {
  localStorage.setItem("employees", JSON.stringify(employees));
  localStorage.setItem("applications", JSON.stringify(applications));
  localStorage.setItem("meetings", JSON.stringify(meetings));
  localStorage.setItem("trainings", JSON.stringify(trainings));
  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
}

function getVal(id) {
  return document.getElementById(id).value.trim();
}

function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.add("hidden"));
  document.getElementById(tab).classList.remove("hidden");

  if (tab === "dashboard") renderCharts();
  if (tab === "employeeList") renderEmployeeList();
  if (tab === "applications") renderApplications();
  if (tab === "meetings") renderMeetings();
  if (tab === "training") renderTraining();
  if (tab === "feedback") renderFeedbacks();
  if (tab === "performance") renderPerformanceChart();
}



// ===============================
// NOTIFICATIONS
// ===============================
function showNotification(msg) {
  const panel = document.getElementById("notificationPanel");
  const note = document.createElement("div");

  note.className = "notification";
  note.textContent = msg;
  panel.appendChild(note);
  panel.classList.remove("hidden");

  playSound();

  setTimeout(() => {
    note.remove();
    if (panel.children.length === 0) panel.classList.add("hidden");
  }, 6000);
}

function playSound() {
  const audio = new Audio("assets/notification.mp3");
  audio.volume = 0.7;
  audio.play().catch(() => {});
}



// ===============================
// RESET DASHBOARD
// ===============================
function resetData() {
  if (confirm("Reset all dashboard data?")) {
    localStorage.clear();
    preloadData();
    loadData();
    updateDashboard();
    renderTraining();
    renderFeedbacks();
    renderMeetings();
    renderApplications();

    showNotification("🔄 Dashboard Reset Successful");
  }
}
