// calendar.js
const weekContainer = document.getElementById("week-selector");
const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
let currentISO = null;   // keeps track of what date is selected

function generateWeek() {
  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay()); // go back to Sunday

  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);

    const iso = d.toISOString().split("T")[0]; // 2025-06-22
    const div = document.createElement("div");
    div.className = "day";
    if (i === today.getDay()) {
      div.classList.add("selected");
      currentISO = iso;
    }

    div.innerHTML = `
      <div class="day-name">${dayNames[d.getDay()]}</div>
      <div class="day-date">${d.getDate()}</div>
    `;

    div.addEventListener("click", () => {
      // visual selection
      document.querySelectorAll(".day").forEach(el => el.classList.remove("selected"));
      div.classList.add("selected");
      // remember & reload tasks
      currentISO = iso;
      loadTasks(currentISO);   // <-- function lives in script.js
    });

    weekContainer.appendChild(div);
  }
}

// expose today’s date so script.js can use it on first load
window.addEventListener("DOMContentLoaded", () => {
  generateWeek();
  if (currentISO) loadTasks(currentISO);
});
