const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "/login.html";
}


document.addEventListener("DOMContentLoaded", async function () {
    const welcomeMessage = document.getElementById("welcome-user-mssg");
    welcomeMessage.textContent = `Welcome!`;
    fetchFriends();
    fetchIncomingRequests();
    fetchOutgoingRequests();
})


async function fetchFriends() {
    const res = await fetch(`/friends/`,
        {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
        }
);
    const friends = await res.json();
    const list = document.getElementById("friendsList");
    list.innerHTML = "";
    friends.forEach(friend => {
    const li = document.createElement("li");
    li.textContent = `${friend.name} (${friend.email})`;
    list.appendChild(li);
    });
}

async function fetchIncomingRequests() {
    const res = await fetch(`/friends/requests/incoming/`,
        {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
        }
    );
    const requests = await res.json();
    const list = document.getElementById("incomingRequests");
    list.innerHTML = "";
    requests.forEach(req => {
    const li = document.createElement("li");
    li.innerHTML = `${req.name} (${req.email})
        <button onclick="accept(${req.friendship_id})">Accept</button>
        <button onclick="reject(${req.friendship_id})">Reject</button>`;
    list.appendChild(li);
    });
}

async function fetchOutgoingRequests() {
    const res = await fetch(`/friends/requests/outgoing/`,
        {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
        }
    );
    const requests = await res.json();
    const list = document.getElementById("outgoingRequests");
    list.innerHTML = "";
    requests.forEach(req => {
    const li = document.createElement("li");
    li.textContent = `${req.name} (${req.email}) — Pending`;
    list.appendChild(li);
    });
}

async function sendFriendRequest() {
    const receiverId = parseInt(document.getElementById("receiverIdInput").value);
    console.log("Receiver ID from element:", receiverId , typeof(receiverId));
    if (isNaN(receiverId)) {
    alert("Enter a valid receiver ID");
    return;
    }

    const res = await fetch(`/friends/requests/${receiverId}`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    });

    const data = await res.json();
    alert(data.message || data.error);
    fetchOutgoingRequests();
}

async function accept(friendshipId) {
    const res = await fetch(`/friends/requests/${friendshipId}/accept`, {
    method: "PATCH"
    });
    const data = await res.json();
    alert(data.message || data.error);
    fetchFriends();
    fetchIncomingRequests();
}

async function reject(friendshipId) {
    const res = await fetch(`/friends/requests/${friendshipId}/reject`, {
    method: "DELETE"
    });
    const data = await res.json();
    alert(data.message || data.error);
    fetchIncomingRequests();
}

// Load data on page load
fetchFriends();
fetchIncomingRequests();
fetchOutgoingRequests();