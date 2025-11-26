// notifications.js — Offline popup + sound alerts (Updated & Enhanced)

let notificationQueue = [];

// === PLAY SOUND (with browser-safe logic) ===
function playSound() {
  try {
    const audio = new Audio("assets/notification.mp3");
    audio.volume = 0.6; // pleasant level
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        console.warn("🔇 Sound blocked until user interacts.");
      });
    }
  } catch (err) {
    console.error("Audio play error:", err);
  }
}

// === SHOW POPUP NOTIFICATION ===
function showNotification(message) {
  playSound();

  const panel = document.getElementById("notificationPanel");
  const note = document.createElement("div");
  note.className = "notification";
  note.textContent = message;
  panel.appendChild(note);
  panel.classList.remove("hidden");

  // Auto-remove after few seconds
  setTimeout(() => {
    note.remove();
    if (panel.children.length === 0) panel.classList.add("hidden");
  }, 5000);
}

// === AUTO MEETING REMINDERS (for demo mode) ===
function scheduleReminders() {
  const storedMeetings = JSON.parse(localStorage.getItem("meetings")) || [];

  storedMeetings.forEach((m, i) => {
    setTimeout(() => {
      showNotification(`🔔 Meeting Reminder: ${m.name} — ${m.topic} at ${m.time}`);
    }, (i + 1) * 20000); // every 20 seconds for demo
  });
}

// === INITIALIZE ===
window.addEventListener("load", () => {
  scheduleReminders();

  // Add a “Test Sound” button if not already there
  if (!document.getElementById("testSoundBtn")) {
    const btn = document.createElement("button");
    btn.id = "testSoundBtn";
    btn.textContent = "🔊 Test Notification Sound";
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.background = "teal";
    btn.style.color = "white";
    btn.style.padding = "10px 16px";
    btn.style.border = "none";
    btn.style.borderRadius = "6px";
    btn.style.cursor = "pointer";
    btn.onclick = () => {
      showNotification("🔔 This is a test notification!");
    };
    document.body.appendChild(btn);
  }
});

// === PANEL STYLE (auto inject) ===
const style = document.createElement("style");
style.innerHTML = `
.panel {
  position: fixed;
  top: 70px;
  right: 20px;
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  background: #fff;
  color: #222;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
  z-index: 1000;
}
body.dark .panel {
  background: #222;
  color: #fff;
}
.notification {
  background: #e0f2f1;
  border-left: 5px solid teal;
  margin-bottom: 8px;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
`;
document.head.appendChild(style);
