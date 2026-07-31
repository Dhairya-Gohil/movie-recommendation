const pool = require("../config/db");

async function findUserByEmail(email) {

    const [rows] = await pool.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows[0];
}

async function findUserById(user_id) {

    const [rows] = await pool.execute(
        "SELECT * FROM users WHERE user_id = ?",
        [user_id]
    );

    return rows[0];
}

async function createUser(user) {

    console.log(user);

    const { full_name, email, password_hash } = user;

    const [result] = await pool.execute(

        `INSERT INTO users
        (full_name,email,password_hash)
        VALUES (?,?,?)`,

        [full_name, email, password_hash]

    );

    return result.insertId;
}

module.exports = {

    findUserByEmail,
    findUserById,
    createUser

};