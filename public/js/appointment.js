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

    // Submit new appointment form
    document.getElementById("appointmentForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!user_id) {
            alert("User ID is missing. Please login again.");
            return;
        }

        const appointmentDate = document.getElementById("appointmentDate").value;
        const doctorName = document.getElementById("doctorName").value;
        const purpose = document.getElementById("purpose").value;

        try {
            const res = await fetch('/appointments', {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({
                    user_id: user_id,
                    appointment_date: appointmentDate, 
                    doctor_name: doctorName, 
                    purpose: purpose 
                })
            });

            if (!res.ok) throw new Error("Create failed");

            loadAppointments();  // Reload the appointments after successful creation
        } catch (err) {
            alert("Failed to create appointment.");
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

    // Edit appointment (currently no functionality here - it's just a placeholder)
    function editAppointment(id) {
        console.log(`Editing appointment with ID: ${id}`);
        // Implement actual editing functionality here
    }

    loadAppointments();  // Load appointments on page load
});
