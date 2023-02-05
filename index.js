require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");
const e = require("express");

app.use(cors());
app.use(express.json());


const client = new MongoClient(process.env.DB_USER_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("boldBlogger");
    const contentCollection = db.collection("content");
    const tagsCollection = db.collection("tags");

    app.get("/tags", async (req, res) => {
      try {
        const cursor = tagsCollection.find();
      const tags = await cursor.toArray();

      res.send({ status: true, data: tags });
      } catch (error) {
        console.log(error);
      }
    });
    app.post("/tags", async (req, res) => {
      try {
        const tags = req.body;
  
        const result = await tagsCollection.insertOne(tags);
  
        res.send(result);
        
      } catch (error) {
        console.log(error);
      }
    });

    app.get("/contents", async (req, res) => {
      try {
        const cursor = contentCollection.find();
        const content = await cursor.toArray();
  
        res.send({ status: true, data: content });
        
      } catch (error) {
        console.log(error);
      }
    });
    
    app.post("/content", async (req, res) => {
      try {
        const content = req.body;
  
        const result = await contentCollection.insertOne(content);
  
        res.send(result);
        
      } catch (error) {
        console.log(error);
      }
    });
   
    app.patch("/content/:id", async (req, res) => {
      try {
        const content = req.body;
        
        const result = await contentCollection.updateOne({ _id : ObjectId(req.params.id)},{$set: {
          // content
          photoLink : content.photoLink,
          title : content.title,
          description : content.description,
          date : content.date,
          tags : content.tags
        }});
        const newContent = await contentCollection.findOne({ _id : ObjectId(req.params.id)});
        res.send({ result , newContent });
        
      } catch (error) {
        console.log(error);
      }
    });

    app.delete("/content/:id", async (req, res) => {
      try {
        const id = req.params.id;
  
        const result = await contentCollection.deleteOne({ _id: ObjectId(id) });
        res.send(result);
        
      } catch (error) {
        console.log(error);
      }
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
