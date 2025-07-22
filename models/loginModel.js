const sql = require("mssql");

exports.findUserByEmail = async (email) => {
  const pool = await sql.connect();
  const result = await pool.request()
    .input("email", sql.NVarChar, email)
    .query("SELECT * FROM Users WHERE email = @email");

  return result.recordset[0];
};
