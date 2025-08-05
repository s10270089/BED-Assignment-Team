const sql = require("mssql");
const dbConfig = require("../dbConfig");

async function findUserByEmail(email) {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("email", sql.NVarChar, email)
    .query("SELECT * FROM Users WHERE email = @email");
  return result.recordset[0];
}

async function findUserByGoogleId(googleId) {
  const pool = await sql.connect(dbConfig);
  const result = await pool.request()
    .input("google_id", sql.NVarChar, googleId)
    .query("SELECT * FROM Users WHERE google_id = @google_id");
  return result.recordset[0];
}

async function createGoogleUser(name, email, googleId, access_token, refresh_token) {
  console.log("atrt: ", access_token, refresh_token);
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("name", sql.NVarChar, name)
    .input("email", sql.NVarChar, email)
    .input("google_id", sql.NVarChar, googleId)
    .input("access_token", sql.NVarChar, access_token)
    .input("refresh_token", sql.NVarChar, refresh_token)
    .query(`INSERT INTO Users (name, email, google_id, access_token, refresh_token) VALUES (@name, @email, @google_id, @access_token, @refresh_token)`);
  
  const result = await pool.request()
    .input("email", sql.NVarChar, email)
    .query("SELECT * FROM Users WHERE email = @email");
  return result.recordset[0];
}

async function updateGoogleUserTokens(userId, access_token, refresh_token) {
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("user_id", sql.Int, userId)
    .input("access_token", sql.NVarChar, access_token)
    .input("refresh_token", sql.NVarChar, refresh_token)
    .query(`
      UPDATE Users 
      SET access_token = @access_token, refresh_token = @refresh_token 
      WHERE user_id = @user_id
    `);
}


async function findOrCreateGoogleUser(profile, access_token, refresh_token) {
  console.log("Received access_token:", access_token);
  console.log("Received refresh_token:", refresh_token);

  const existingUser = await findUserByGoogleId(profile.id);

  if (existingUser) {
    await updateGoogleUserTokens(existingUser.user_id, access_token, refresh_token);
    return existingUser;
  }

  const name = profile.displayName;
  const email = profile.emails?.[0]?.value || null;

  return await createGoogleUser(name, email, profile.id, access_token, refresh_token);
}

module.exports = {
  findUserByEmail,
  createGoogleUser,
  findUserByGoogleId,
  findOrCreateGoogleUser
};
