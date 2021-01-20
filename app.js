const express = require("express");
const config = require("config");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const PORT = config.get("port") || 3000;
const app = express();

app.use(bodyParser.json({ extended: true })); // body parser must be set before router or req.body will be undefined!

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/link", require("./routes/link.routes"));
app.use("/t", require("./routes/redirect.routes"));

if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path.join(__dirname, "client", "build")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

async function start() {
    try {
        await mongoose.connect(config.get("mongoUri"), {
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        app.listen(PORT, () => {
            console.log(`Server up and running on port ${PORT}`);
        });
    } catch (e) {
        console.log("MongoDB server error ", e.message);
        process.exit(1);
    }
}

start();
