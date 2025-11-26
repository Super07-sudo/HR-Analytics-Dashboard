// chart-utils.js — adds extra polish to Chart.js visuals

// Smoothly destroy old charts before redrawing
function resetChart(chartId) {
  const oldChart = Chart.getChart(chartId);
  if (oldChart) oldChart.destroy();
}

// Animate summary counters
function animateValue(id, start, end, duration = 1000) {
  const obj = document.getElementById(id);
  const range = end - start;
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    obj.textContent = Math.floor(start + range * progress);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Show quick insights
function generateInsights(employees) {
  const hrCount = employees.filter(e => e.department === "HR").length;
  const itCount = employees.filter(e => e.department === "IT").length;
  const highSatisfaction = employees.filter(e => e.job_satisfaction >= 4).length;

  return `
    HR Department employees: ${hrCount}<br>
    IT Department employees: ${itCount}<br>
    Highly satisfied employees: ${highSatisfaction}
  `;
}
