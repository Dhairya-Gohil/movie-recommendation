require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {

        const connection = await pool.getConnection();

        console.log("✅ MySQL Connected");

        connection.release();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {

        console.error(error);

    }
}

startServer();