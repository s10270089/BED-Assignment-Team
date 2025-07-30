const token = localStorage.getItem("token");

  async function fetchDashboardData() {
    try {
      const res = await fetch('/dashboard/data', {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to fetch dashboard data");

      const data = await res.json();
        
      // Set username
      document.getElementById("username").innerText = data.userInfo.name;

      // Set BMI
      document.getElementById("bmiValue").innerText = `Your BMI is: ${data.userInfo.bmi}`;
      document.getElementById("bmiCategory").innerText = `Category: ${determineBMICategory(data.userInfo.bmi)}`;
      setBmiMeter(data.userInfo.bmi);

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
        <li>${reminder.title} - ${new Date(reminder.reminder_time).toLocaleDateString()}</li>
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

  function setBmiMeter(bmi) {
    const ctx = document.getElementById('bmiMeter').getContext('2d');
    // Remove any previous chart instance
    if (window.bmiMeterChart) {
      window.bmiMeterChart.destroy();
    }

    // Define BMI ranges and colors
    const bmiRanges = [18.5, 24.9 - 18.5, 29.9 - 24.9, 40 - 29.9];
    const bmiLabels = ['Underweight', 'Normal', 'Overweight', 'Obesity'];
    const bmiColors = ['#FF5733', '#4CAF50', '#FF9800', '#F44336'];

    // Calculate the position of the user's BMI for the needle
    const minBMI = 0;
    const maxBMI = 40;
    const angle = Math.PI + (bmi - minBMI) / (maxBMI - minBMI) * Math.PI;

    window.bmiMeterChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: bmiLabels,
        datasets: [{
          data: bmiRanges,
          backgroundColor: bmiColors,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        rotation: Math.PI, // Start at bottom
        circumference: Math.PI, // 180 degrees
        cutout: '70%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `${context.label}: ${context.parsed} BMI`;
              }
            }
          },
        },
      },
      plugins: [{
        id: 'needle',
        afterDraw: chart => {
          const {ctx, chartArea, chartArea: {width, height}} = chart;
          const centerX = chart.getDatasetMeta(0).data[0].x;
          const centerY = chart.getDatasetMeta(0).data[0].y;
          const radius = chart.getDatasetMeta(0).data[0].outerRadius;
          // Needle endpoint
          const needleLength = radius * 0.95;
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -needleLength);
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#222';
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, 7, 0, 2 * Math.PI);
          ctx.fillStyle = '#222';
          ctx.fill();
          ctx.restore();
        }
      }]
    });
  }

  // Map BMI value to corresponding degree in the semi-circle
  function mapBMIToDegree(bmi) {
    if (bmi < 18.5) return 0;
    if (bmi >= 18.5 && bmi < 24.9) return 45;
    if (bmi >= 25 && bmi < 29.9) return 90;
    return 135;
  }

  // Call the function to load data
  fetchDashboardData();