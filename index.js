const express = require("express");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

//Mongo Client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@travelbookingcluster.ew8yc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("packageData");
    const packageCollection = database.collection("packageCollection");

    //GET API for packages
    app.get("/packages", async (req, res) => {
      const cursor = packageCollection.find({});
      const result = await cursor.toArray();
      console.log("Getting all packages");
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

//Getting main endpoint
app.get("/", (req, res) => {
  res.send("Travel Booking Server is running...");
});

//Listening at the port
app.listen(port, (req, res) => {
  console.log("Server running at port", port);
});
