document.addEventListener("DOMContentLoaded", function() {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) {
        alert("User ID is missing. Please log in again.");
        window.location.href = "login.html"; // Redirect to login page
        return;
    }
    
    const token = localStorage.getItem("token");

    // Load appointments when the page is loaded
    async function loadAppointments() {
        try {
            const res = await fetch('/appointments', {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Failed to fetch appointments");

            const data = await res.json();
            const tbody = document.getElementById("appointmentsBody");

            tbody.innerHTML = "";
            data.forEach(appointment => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${appointment.appointment_id}</td>
                    <td>${appointment.doctor_name}</td>
                    <td>${appointment.purpose}</td>
                    <td>${new Date(appointment.appointment_date).toLocaleString()}</td>
                    <td>
                        <button class="editBtn" data-id="${appointment.appointment_id}">Edit</button>
                        <button class="deleteBtn" data-id="${appointment.appointment_id}">Delete</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            // Add event listeners for edit and delete buttons
            addEventListeners();
        } catch (err) {
            console.error("Error loading appointments:", err);
            alert("Failed to load appointments");
        }
    }

    // Add event listeners for the edit and delete buttons
    function addEventListeners() {
        const editButtons = document.querySelectorAll('.editBtn');
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const appointmentId = button.getAttribute('data-id');
                editAppointment(appointmentId);
            });
        });

        const deleteButtons = document.querySelectorAll('.deleteBtn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const appointmentId = button.getAttribute('data-id');
                deleteAppointment(appointmentId);
            });
        });
    }

    // Keep track of the appointment currently being edited
    let editingAppointmentId = null;

    // Edit appointment
    async function editAppointment(id) {
        try {
            const res = await fetch(`/appointments/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Failed to fetch appointment");

            const appointment = await res.json();

            // Fill the form with the existing appointment data
            document.getElementById("appointmentDate").value = appointment.appointment_date.split("T")[0] + "T" + appointment.appointment_date.split("T")[1].slice(0,5);
            document.getElementById("doctorName").value = appointment.doctor_name;
            document.getElementById("purpose").value = appointment.purpose;

            // Set editing mode
            editingAppointmentId = id;

            // Change submit button text
            document.getElementById("submitBtn").textContent = "Update Appointment";

        } catch (err) {
            console.error("Error loading appointment for edit:", err);
            alert("Failed to load appointment details");
        }
    }

    // Modify form submission to handle both create and update
    document.getElementById("appointmentForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const appointmentDate = document.getElementById("appointmentDate").value;
        const doctorName = document.getElementById("doctorName").value;
        const purpose = document.getElementById("purpose").value;

        try {
            let url = '/appointments';
            let method = 'POST';
            let bodyData = {
                user_id: user_id,
                appointment_date: appointmentDate,
                doctor_name: doctorName,
                purpose: purpose
            };

            // If in editing mode, switch to PUT
            if (editingAppointmentId) {
                url = `/appointments/${editingAppointmentId}`;
                method = 'PUT'; // or PATCH, depending on your backend
            }

            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(bodyData)
            });

            if (!res.ok) throw new Error(`${method} failed`);

            // Reset form and mode
            editingAppointmentId = null;
            document.getElementById("submitBtn").textContent = "Add Appointment";
            document.getElementById("appointmentForm").reset();

            loadAppointments(); // Reload table
        } catch (err) {
            alert("Failed to save appointment.");
            console.error(err);
        }
    });

    // Delete appointment
    async function deleteAppointment(id) {
        if (!confirm("Are you sure you want to delete this appointment?")) return;

        try {
            const res = await fetch(`/appointments/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Delete failed");

            loadAppointments();
        } catch (err) {
            alert("Failed to delete appointment.");
            console.error(err);
        }
    }

    
    loadAppointments();  // Load appointments on page load
});
