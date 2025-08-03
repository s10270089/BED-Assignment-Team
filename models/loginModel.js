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

async function createGoogleUser(name, email, googleId) {
  const pool = await sql.connect(dbConfig);
  await pool.request()
    .input("name", sql.NVarChar, name)
    .input("email", sql.NVarChar, email)
    .input("google_id", sql.NVarChar, googleId)
    .query(`INSERT INTO Users (name, email, google_id) VALUES (@name, @email, @google_id)`);

  const result = await pool.request()
    .input("email", sql.NVarChar, email)
    .query("SELECT * FROM Users WHERE email = @email");
  return result.recordset[0];
}

async function findOrCreateGoogleUser(profile) {

  /*
  //find user by email 
  const aemail = profile.emails?.[0]?.value || null;
  console.log("Email from profile:", aemail);
  if (aemail) {
    auser = findUserByEmail(aemail);
    //get google id
    console.log(profile.id);

    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
    // set google id
      .input("google_id", sql.NVarChar, googleId)
      .query("SELECT * FROM Users WHERE google_id = @google_id");
    
  } else {
    */

  const existingUser = await findUserByGoogleId(profile.id);
  //console.log("Existing User:", existingUser); 
  if (existingUser) return existingUser;

  const name = profile.displayName;
  const email = profile.emails?.[0]?.value || null;
  console.log("name:", name);
  return await createGoogleUser(name, email, profile.id);
}

module.exports = {
  findUserByEmail,
  createGoogleUser,
  findUserByGoogleId,
  findOrCreateGoogleUser
};
