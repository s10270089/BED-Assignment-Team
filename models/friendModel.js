const sql = require("mssql");
const dbConfig = require("../../../db/dbConfig");

exports.getFriends = async (userId) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("userId", sql.Int, userId)
    .query(`
      SELECT u.user_id, u.name, u.email
      FROM Friendships f
      JOIN Users u ON 
        (u.user_id = f.sender_id AND f.receiver_id = @userId) OR
        (u.user_id = f.receiver_id AND f.sender_id = @userId)
      WHERE f.status = 'accepted' AND u.user_id != @userId
    `);
  return result.recordset;
};

exports.getIncomingRequests = async (userId) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("userId", sql.Int, userId)
    .query(`
      SELECT f.friendship_id, u.user_id, u.name, u.email
      FROM Friendships f
      JOIN Users u ON u.user_id = f.sender_id
      WHERE f.receiver_id = @userId AND f.status = 'pending'
    `);
  return result.recordset;
};

exports.getOutgoingRequests = async (userId) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("userId", sql.Int, userId)
    .query(`
      SELECT f.friendship_id, u.user_id, u.name, u.email
      FROM Friendships f
      JOIN Users u ON u.user_id = f.receiver_id
      WHERE f.sender_id = @userId AND f.status = 'pending'
    `);
  return result.recordset;
};

exports.sendFriendRequest = async (senderId, receiverId) => {
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("senderId", sql.Int, senderId)
    .input("receiverId", sql.Int, receiverId)
    .input("status", sql.NVarChar, 'pending')
    .query(`
      INSERT INTO Friendships (sender_id, receiver_id, status)
      VALUES (@senderId, @receiverId, @status)
    `);
};

exports.updateRequestStatus = async (friendshipId, status) => {
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("friendshipId", sql.Int, friendshipId)
    .input("status", sql.NVarChar, status)
    .query(`
      UPDATE Friendships SET status = @status WHERE friendship_id = @friendshipId
    `);
};
