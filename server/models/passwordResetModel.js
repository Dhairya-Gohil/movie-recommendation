const crypto = require("crypto");
const pool = require("../config/db");

async function createPasswordReset(user_id, token_hash, expires_at) {
    await pool.execute(
        "delete from password_resets where user_id = ?",
        [user_id]
    );

    const [result] = await pool.execute(
        `insert into password_resets
        (user_id, token_hash, expires_at)
        values (?, ?, ?)`,
        [user_id, token_hash, expires_at]
    );

    return result.insertId;
}

async function findPasswordResetByToken(token_hash) {
    const [rows] = await pool.execute(
        `select *
        from password_resets
        where token_hash = ?
        and expires_at > now()
        limit 1`,
        [token_hash]
    );

    return rows[0];
}

async function deletePasswordReset(reset_id) {
    await pool.execute(
        "delete from password_resets where reset_id = ?",
        [reset_id]
    );
}

async function deletePasswordResetsByUser(user_id) {
    await pool.execute(
        "delete from password_resets where user_id = ?",
        [user_id]
    );
}

module.exports = {
    createPasswordReset,
    findPasswordResetByToken,
    deletePasswordReset,
    deletePasswordResetsByUser
};