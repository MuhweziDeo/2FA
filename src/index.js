const { app } = require("./app");
const {PORT, DB_URI} = require("./config");
const mongodb = require("mongoose");

mongodb.connect(DB_URI)
.then(console.log("connected"));

// console.log(app);
app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
})