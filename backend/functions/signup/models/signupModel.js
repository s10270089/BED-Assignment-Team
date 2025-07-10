const sql = require("mssql");

exports.insertUser = async ({ name, email, hashedPassword, birthday, age }) => {
  const pool = await sql.connect();

  return pool.request()
    .input("name", sql.NVarChar, name)
    .input("email", sql.NVarChar, email)
    .input("password_hash", sql.NVarChar, hashedPassword)
    .input("birthday", sql.Date, birthday)
    .input("age", sql.Int, age)
    .query(`
      INSERT INTO Users (name, email, password_hash, birthday, age)
      VALUES (@name, @email, @password_hash, @birthday, @age)
    `);
};
