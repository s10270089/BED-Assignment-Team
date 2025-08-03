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

    // Set User Profile Photo
    const profilePhoto = data.userInfo.profile_photo_url || 'https://res.cloudinary.com/dqnoqh0hi/image/upload/v1738043451/samples/people/boy-snow-hoodie.jpg'; // Fallback image if none available
    document.getElementById("profilePhoto").src = profilePhoto;

    // Set user's birthday - Format as dd month name, yyyy
    const userBirthday = new Date(data.userInfo.birthday);
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const formattedBirthday = userBirthday.toLocaleDateString('en-GB', options); // English format, 'day month name, year'
    document.getElementById("userBirthday").innerText = `${formattedBirthday}`;

    // Set BMI
    document.getElementById("bmiValue").innerText = `Your BMI is: ${data.userInfo.bmi}`;
    document.getElementById("bmiCategory").innerText = `Category: ${determineBMICategory(data.userInfo.bmi)}`;

    // Set the BMI meter needle (inside fetch)
    setBmiNeedle(Number(data.userInfo.bmi));
    updateBmiProgress(Number(data.userInfo.bmi));

    // Set Medications
    const medicationsList = document.getElementById("medicationsList");
    if (data.medications && data.medications.length > 0) {
      medicationsList.innerHTML = data.medications.map(medication => `
        <li class="medication-item">
          <img src="${medication.icon}" alt="${medication.name} icon" class="medication-icon">
          <span class="medication-name">${medication.name}</span>
          <span class="medication-frequency">${medication.frequency}</span>
        </li>
      `).join('');
    } else {
      medicationsList.innerHTML = '<li>No medications available</li>';
      medicationsList.innerHTML += '<li><button onclick="location.href=\'/medications.html\'">View Medications</button></li>';
    }

    // Set Friends List
    const friendsList = document.getElementById("friendsList");
    if (data.friendsList && data.friendsList.length > 0) {
      friendsList.innerHTML = data.friendsList.map(friend => `<li>${friend.name}</li>`).join('');
    } else {
      friendsList.innerHTML = '<li>No friends found</li>';
      friendsList.innerHTML += '<li><button onclick="location.href=\'/friends.test.html\'">View Friends</button></li>';
    }

    // Set Upcoming Events
    const eventsList = document.getElementById("eventsList");
    if (data.upcomingEvents && data.upcomingEvents.length > 0) {
      eventsList.innerHTML = data.upcomingEvents.map(event => `
        <li>${event.title} - ${new Date(event.event_start_time).toLocaleDateString()}</li>
      `).join('');
    } else {
      eventsList.innerHTML = '<li>No upcoming events</li>';
      eventsList.innerHTML += '<li><button onclick="location.href=\'/events.html\'">View Events</button></li>';
    }

    // Set Health Records
    const healthRecordsList = document.getElementById("healthRecordsList");
    if (data.healthRecords && data.healthRecords.length > 0) {
      healthRecordsList.innerHTML = data.healthRecords.map(record => `
        <li class="health-record-item">
          <strong>Last Updated: ${new Date(record.last_Updated).toLocaleDateString()}</strong><br>
          <span>Allergies: ${record.allergies || 'None'}</span><br>
          <span>Diagnosis: ${record.diagnosis || 'N/A'}</span>
        </li>
      `).join('');
    } else {
      healthRecordsList.innerHTML = '<li>No health records available</li>';
      healthRecordsList.innerHTML += '<li><button onclick="location.href=\'/health-records.html\'">View Health Records</button></li>';
    }

    // Set Reminders
    const remindersList = document.getElementById("remindersList");
    if (data.reminders && data.reminders.length > 0) {
      remindersList.innerHTML = data.reminders.map(reminder => `
        <li>${reminder.message} - ${new Date(reminder.reminder_time).toLocaleDateString()}</li>
      `).join('');
    } else {
      remindersList.innerHTML = '<li>No reminders set</li>';
      remindersList.innerHTML += '<li><button onclick="location.href=\'/reminder.html\'">View Reminders</button></li>';
    }

    // Set Appointments
    const appointmentsList = document.getElementById("appointmentsList");
    if (data.appointments && data.appointments.length > 0) {
      appointmentsList.innerHTML = data.appointments.map(appointment => `
        <li>${appointment.doctor_name} - ${new Date(appointment.appointment_date).toLocaleDateString()} at ${new Date(appointment.appointment_date).toLocaleTimeString()}</li>
      `).join('');
    }
    else {
      appointmentsList.innerHTML = '<li>No appointments scheduled</li>';
      appointmentsList.innerHTML += '<li><button onclick="location.href=\'/appointments.html\'">View Appointments</button></li>';
    }
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
