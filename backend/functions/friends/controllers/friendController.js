const eventModel = require("../models/friendModel");

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

exports.updateStatus = async (req, res) => {
  const { friendshipId } = req.params;
  const { status } = req.body;
  try {
    await friendModel.updateRequestStatus(friendshipId, status);
    res.json({ message: `Friend request ${status}.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
