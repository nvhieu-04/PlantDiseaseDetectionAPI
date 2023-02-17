const bodyParser = require("body-parser");
const InitiateMongoServer = require("./config/db");
const express = require("express");
const user = require("./routes/user"); // Imports routes for the products
const dataset = require("./routes/datasets"); // Imports routes for the products
// Initiate Mongo Server
InitiateMongoServer();

const app = express();
const port = 3000;
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello World!"));
app.use("/user", user);
app.use("/datasets", dataset);
app.listen(port, () => console.log(`App listening on port ${port}!`));
