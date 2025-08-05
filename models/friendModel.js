const sql = require("mssql");
const dbConfig = require("../dbConfig");

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
  console.log("Fetching incoming requests for userId:", userId);
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

  // Check if a friendship or pending request already exists
  const existing = await pool.request()
    .input("senderId", sql.Int, senderId)
    .input("receiverId", sql.Int, receiverId)
    .query(`
      SELECT * FROM Friendships
      WHERE 
        (sender_id = @senderId AND receiver_id = @receiverId)
        OR 
        (sender_id = @receiverId AND receiver_id = @senderId)
    `);

  if (existing.recordset.length > 0) {
    throw new Error("A friendship or pending request already exists.");
  }
  //otherwisse, create new request
  await pool.request()
    .input("senderId", sql.Int, senderId)
    .input("receiverId", sql.Int, receiverId)
    .input("status", sql.NVarChar, 'pending')
    .query(`
      INSERT INTO Friendships (sender_id, receiver_id, status)
      VALUES (@senderId, @receiverId, @status)
    `);
};

exports.updateFriendshipStatusById = async (friendshipId, status) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("friendshipId", sql.Int, friendshipId)
    .input("status", sql.NVarChar, status)
    .query(`
      UPDATE Friendships
      SET status = @status
      WHERE friendship_id = @friendshipId AND status = 'pending'
    `);

  return result.rowsAffected[0]; // returns 1 if updated, 0 if not
};

exports.deleteFriendshipRequestById = async (friendshipId) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("friendshipId", sql.Int, friendshipId)
    .query(`
      DELETE FROM Friendships
      WHERE friendship_id = @friendshipId AND status = 'pending'
    `);
    
  return result.rowsAffected[0]; // 1 if deleted, 0 if not found
};

exports.removeFriendById = async (friendshipId) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("friendshipId", sql.Int, friendshipId)
    .query(`
      DELETE FROM Friendships
      WHERE friendship_id = @friendshipId AND status = 'accepted'
    `);

  return result.rowsAffected[0]; // 1 if deleted, 0 if not
};




exports.getFriendshipId = async (senderId, receiverId) => {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("senderId", sql.Int, senderId)
    .input("receiverId", sql.Int, receiverId)
    .query(`
      SELECT friendship_id FROM Friendships
      WHERE (sender_id = @senderId AND receiver_id = @receiverId)
         OR (sender_id = @receiverId AND receiver_id = @senderId)
    `);
  
  return result.recordset[0]; // returns { friendship_id: X } or undefined
};