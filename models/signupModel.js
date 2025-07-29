const sql = require("mssql");

exports.insertUser = async ({ name, email, hashedPassword, birthday, weight, height }) => {
  const pool = await sql.connect();

  return pool.request()
    .input("name", sql.NVarChar, name)
    .input("email", sql.NVarChar, email)
    .input("password_hash", sql.NVarChar, hashedPassword)
    .input("birthday", sql.Date, birthday)
    .input("weight", sql.NVarChar, weight)
    .input("height", sql.NVarChar, height)
    .query(`
      INSERT INTO Users (name, email, password_hash, birthday, weight, height)
      VALUES (@name, @email, @password_hash, @birthday, @weight, @height)
    `);
};

