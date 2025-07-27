const sql = require("mssql");

exports.insertUser = async ({ name, email, hashedPassword, birthday}) => {
  const pool = await sql.connect();

  return pool.request()
    .input("name", sql.NVarChar, name)
    .input("email", sql.NVarChar, email)
    .input("password_hash", sql.NVarChar, hashedPassword)
    .input("birthday", sql.Date, birthday)
    .query(`
      INSERT INTO Users (name, email, password_hash, birthday)
      VALUES (@name, @email, @password_hash, @birthday)
    `);
};
