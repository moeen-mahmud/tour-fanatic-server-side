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
    const userCollection = database.collection("userCollection");

    //GET API for packages
    app.get("/packages", async (req, res) => {
      const cursor = packageCollection.find({});
      const result = await cursor.toArray();
      console.log("Getting all packages");
      res.json(result);
    });

    //ADD a package
    app.post("/packages", async (req, res) => {
      const package = req.body;
      const result = await packageCollection.insertOne(package);
      res.json(result);
    });

    //GET package by id
    app.get("/packages/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const package = await packageCollection.findOne(query);
      console.log("Booked package", package);
      res.json(package);
    });

    //POST user collection
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.json(result);
    });

    //GET user packages from user collection
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    //DELETE user package from users collection
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.json(result);
    });

    //PUT or EDIT user package status
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updateStatus = req.body;
      const filter = { _id: ObjectId(id) };
      const option = { upsert: true };
      const updateDoc = {
        $set: {
          packageStatus: updateStatus.packageStatus,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, option);
      console.log("Updating Status", result);
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
