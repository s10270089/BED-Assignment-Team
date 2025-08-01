const token = localStorage.getItem("token");

async function fetchDashboardData() {
  try {
    const res = await fetch('/dashboard/data', {
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Failed to fetch dashboard data: ${error}`);
    }

    const data = await res.json();

    // Set username
    document.getElementById("username").innerText = data.userInfo.name;

    // Set BMI
    document.getElementById("bmiValue").innerText = `Your BMI is: ${data.userInfo.bmi}`;
    document.getElementById("bmiCategory").innerText = `Category: ${determineBMICategory(data.userInfo.bmi)}`;

    // Set the BMI meter needle (inside fetch)
    setBmiNeedle(Number(data.userInfo.bmi));
    updateBmiProgress(Number(data.userInfo.bmi));

    // Set Friends List
    const friendsList = document.getElementById("friendsList");
    friendsList.innerHTML = data.friendsList.map(friend => `<li>${friend.name}</li>`).join('');

    // Set Upcoming Events
    const eventsList = document.getElementById("eventsList");
    eventsList.innerHTML = data.upcomingEvents.map(event => `
      <li>${event.title} - ${new Date(event.event_time).toLocaleDateString()}</li>
    `).join('');

    // Set Reminders
    const remindersList = document.getElementById("remindersList");
    remindersList.innerHTML = data.reminders.map(reminder => `
      <li>${reminder.message} - ${new Date(reminder.reminder_time).toLocaleDateString()}</li>
    `).join('');

  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    alert("There was an issue loading your dashboard data.");
  }
}

function determineBMICategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi >= 18.5 && bmi < 24.9) return 'Normal weight';
  if (bmi >= 25 && bmi < 29.9) return 'Overweight';
  return 'Obese';
}

function setBmiNeedle(bmi) {
  const minBMI = 16;
  const maxBMI = 40;
  const minAngle = -90;
  const maxAngle = 90;

  bmi = Math.max(minBMI, Math.min(maxBMI, bmi));
  const angle = minAngle + ((bmi - minBMI) / (maxBMI - minBMI)) * (maxAngle - minAngle);
  const needleLength = 110;
  const angleRad = (angle - 90) * Math.PI / 180;

  const centerX = 120, centerY = 120;
  const endX = centerX + needleLength * Math.cos(angleRad);
  const endY = centerY + needleLength * Math.sin(angleRad);

  document.getElementById('bmiNeedleOverlay').innerHTML = `
    <svg width="240" height="140">
      <line x1="${centerX}" y1="${centerY}" x2="${endX}" y2="${endY}" stroke="#222" stroke-width="4" />
      <circle cx="${centerX}" cy="${centerY}" r="7" fill="#222" />
    </svg>
  `;
}

function updateBmiProgress(bmi) {
  const progressBar = document.getElementById("bmiProgress").firstElementChild;
  const progress = Math.min((bmi - 16) / (40 - 16) * 100, 100);
  progressBar.style.width = `${progress}%`;
}

fetchDashboardData();
