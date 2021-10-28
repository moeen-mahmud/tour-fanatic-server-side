const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//Getting main endpoint
app.get("/", (req, res) => {
  res.send("Travel Booking Server is running...");
});

//Listening at the port
app.listen(port, (req, res) => {
  console.log("Server running at port", port);
});
