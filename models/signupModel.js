const sql = require("mssql");

exports.insertUser = async ({ name, email, hashedPassword, birthday }) => {
  const pool = await sql.connect();

  const result = await pool.request()
    .input("name", sql.NVarChar, name)
    .input("email", sql.NVarChar, email)
    .input("password_hash", sql.NVarChar, hashedPassword)
    .input("birthday", sql.Date, birthday)
    .input("weight", sql.Float, weight)
    .input("height", sql.Float, height)
    .query(`
      INSERT INTO Users (name, email, password_hash, birthday)
      OUTPUT INSERTED.user_id
      VALUES (@name, @email, @password_hash, @birthday)
    `);

  return result.recordset[0].user_id;
};

exports.insertUserProfile = async (userId) => {
  const pool = await sql.connect();
  await pool.request()
    .input("user_id", sql.Int, userId)
    .input("profile_photo_url", sql.NVarChar, 'http://example.com/img.jpg')
    .query(`
      INSERT INTO UserProfiles (user_id, profile_photo_url)
      VALUES (@user_id, @profile_photo_url)
    `);
};


