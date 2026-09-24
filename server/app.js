const express = require("express");
const cors = require("cors");
const indexRoutes = require("./routes/indexRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", indexRoutes);
app.get("/", (req, res) => {

    res.json({

        message: "Movie Recommendation API Running..."

    });

});

module.exports = app;