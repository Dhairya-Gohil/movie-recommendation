const pool = require("../config/db");

async function findUserByEmail(email) {

    const [rows] = await pool.execute(
        "select * from users where email = ?",
        [email]
    );

    return rows[0];
}

async function findUserById(user_id) {

    const [rows] = await pool.execute(
        "select * from users where user_id = ?",
        [user_id]
    );

    return rows[0];
}

async function createUser(user) {

    console.log(user);

    const { full_name, email, password_hash } = user;

    const [result] = await pool.execute(

        `insert into users
        (full_name, email, password_hash)
        values (?, ?, ?)`,

        [full_name, email, password_hash]

    );

    return result.insertId;
}

async function updateUserPassword(user_id, password_hash) {

    await pool.execute(
        `update users
        set password_hash = ?
        where user_id = ?`,
        [password_hash, user_id]
    );

}

module.exports = {

    findUserByEmail,
    findUserById,
    createUser,
    updateUserPassword

};