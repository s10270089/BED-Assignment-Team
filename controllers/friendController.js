const friendModel = require("../models/friendModel");


exports.getFriends = async (req, res) => {
  try {
    const friends = await friendModel.getFriends(req.params.userId);
    res.json(friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getIncomingRequests = async (req, res) => {
  try {
    const requests = await friendModel.getIncomingRequests(req.params.userId);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOutgoingRequests = async (req, res) => {
  try {
    const requests = await friendModel.getOutgoingRequests(req.params.userId);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    await friendModel.sendFriendRequest(senderId, receiverId);
    res.json({ message: "Friend request sent." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.acceptFriendRequestById = async (req, res) => {
  const { friendshipId } = req.params;

  try {
    const affected = await friendModel.updateFriendshipStatusById(parseInt(friendshipId), 'accepted');

    if (affected === 0) {
      return res.status(404).json({ error: "No pending request found with this friendship ID" });
    }

    res.status(200).json({ message: "Friend request accepted." });
  } catch (err) {
    console.error("Error accepting friend request:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.rejectFriendRequestById = async (req, res) => {
  const { friendshipId } = req.params;

  try {
    const affected = await friendModel.deleteFriendshipRequestById(parseInt(friendshipId));

    if (affected === 0) {
      return res.status(404).json({ error: "No pending request found with this friendship ID" });
    }

    res.status(200).json({ message: "Friend request rejected and deleted." });
  } catch (err) {
    console.error("Error deleting friendship:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};



exports.getFriendshipId = async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    const data = await friendModel.getFriendshipId(parseInt(senderId), parseInt(receiverId));
    if (!data) {
      return res.status(404).json({ error: "Friendship not found" });
    }

    res.status(200).json({ friendshipId: data.friendship_id });
  } catch (err) {
    console.error("Error getting friendship ID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.removeFriendById = async (req, res) => {
  const { friendshipId } = req.params;

  try {
    const affected = await friendModel.removeFriendById(parseInt(friendshipId));

    if (affected === 0) {
      return res.status(404).json({ error: "Friendship not found or already removed." });
    }

    res.status(200).json({ message: "Friendship successfully removed." });
  } catch (err) {
    console.error("Error deleting friendship:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
