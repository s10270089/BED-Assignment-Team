const friendModel = require("../models/friendModel");
const jwt = require('jsonwebtoken');



// Helper for integer param validation
function isPositiveInt(val) {
  return !isNaN(val) && Number.isInteger(Number(val)) && Number(val) > 0;
}

exports.getFriends = async (req, res) => {
  user = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
  const userId = user.user_id;
  console.log("User ID from token:", userId);

  if (!userId) {
    return res.status(400).json({ error: "Invalid userId or unauthorised" });
  }
  try {
    const friends = await friendModel.getFriends(userId);
    res.json(friends);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getIncomingRequests = async (req, res) => {
    user = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
    const userId = user.user_id;
    console.log("User ID from token:", userId);

  if (!userId) {
    return res.status(400).json({ error: "Invalid userId parameter." });
  }
  try {
    const requests = await friendModel.getIncomingRequests(userId);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getOutgoingRequests = async (req, res) => {
 user = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
  const userId = user.user_id;
  if (!userId) {
    return res.status(400).json({ error: "Invalid userId parameter." });
  }
  try {
    const requests = await friendModel.getOutgoingRequests(userId);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendRequest = async (req, res) => {
   user = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);  
  const senderId = user.user_id;
  console.log("REC ID from token:", req.params.receiverId);
  const receiverId = parseInt(req.params.receiverId);
  console.log("Sender ID from token:", senderId, "Receiver ID from params:", receiverId);
  if (!isPositiveInt(senderId) || !isPositiveInt(receiverId)) {
    return res.status(400).json({ error: "senderId and receiverId must be positive integers." });
  }
  if (senderId === receiverId) {
    return res.status(400).json({ error: "Cannot send request to yourself." });
  }

  try {
    await friendModel.sendFriendRequest(senderId, receiverId);
    res.json({ message: "Friend request sent." });
  } catch (err) {
    if (err.message.includes("already exists")) {
      res.status(409).json({ error: err.message }); // Conflict
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

exports.acceptFriendRequestById = async (req, res) => {
  const { friendshipId } = req.params;
  if (!isPositiveInt(friendshipId)) {
    return res.status(400).json({ error: "Invalid friendshipId parameter." });
  }

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
  if (!isPositiveInt(friendshipId)) {
    return res.status(400).json({ error: "Invalid friendshipId parameter." });
  }

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
  if (!isPositiveInt(senderId) || !isPositiveInt(receiverId)) {
    return res.status(400).json({ error: "senderId and receiverId must be positive integers." });
  }

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
  if (!isPositiveInt(friendshipId)) {
    return res.status(400).json({ error: "Invalid friendshipId parameter." });
  }

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
