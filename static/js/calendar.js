// calendar.js
const weekContainer = document.getElementById("week-selector");
let currentISO = "";          // globally available selected date (YYYY-MM-DD)

/** build the 7-day strip starting with Sunday */
function generateWeek() {
  weekContainer.innerHTML = "";      // clear any previous boxes

  const today = new Date();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());   // back to Sunday

  for (let i = 0; i < 7; i++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);

    const iso = date.toISOString().split("T")[0];      // 2025-06-22
    const box = document.createElement("div");
    box.className = "day-box";

    // mark today
    if (date.toDateString() === today.toDateString()) {
      box.classList.add("selected");
      currentISO = iso;
    }

    // box content
    box.innerHTML = `
      <div class="day-name">${date.toLocaleDateString("en-US", { weekday: "short" })}</div>
      <div class="day-date">${date.getDate()}</div>
    `;

    // click behaviour
    box.addEventListener("click", () => {
      document.querySelectorAll(".day-box").forEach(el => el.classList.remove("selected"));
      box.classList.add("selected");
      currentISO = iso;
      if (typeof loadTasks === "function") loadTasks(currentISO);  // from script.js
    });

    weekContainer.appendChild(box);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  generateWeek();
  if (typeof loadTasks === "function" && currentISO) loadTasks(currentISO);
  // expose for other scripts
  window.currentISO = currentISO;
});
