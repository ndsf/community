const {ApolloServer, PubSub} = require("apollo-server-express");
const mongoose = require("mongoose");
const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const {slugify} = require("transliteration");
const fs = require("fs");
require("dotenv").config();

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => ({req, pubsub})
});

const app = express();
app.use(fileUpload());

// Upload Endpoint
app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({msg: "No file uploaded"});
  }

  const file = req.files.file;

  let filepath;
  if (process.env.NODE_ENV === "production")
    filepath = `${__dirname}/client/build/uploads/${slugify(file.name, {
      ignore: ["."]
    })}`;
  else
    filepath = `${__dirname}/client/public/uploads/${slugify(file.name, {
      ignore: ["."]
    })}`;

  fs.mkdirSync(path.dirname(filepath), { recursive: true });

  try {
    fs.unlinkSync(filepath);
    //file removed
  } catch(err) {
    console.error(err);
  }

  file.mv(
      filepath,
      err => {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }

        res.json({
          fileName: slugify(file.name, {ignore: ["."]}),
          filePath: `/uploads/${slugify(file.name, {ignore: ["."]})}`
        });
      }
  );
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
  });
}

server.applyMiddleware({app, path: "/"});

const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
  console.log("MongoDB connected");
  return app.listen({port}, () => {
    console.log(`Server running at ${port}`);
  });
});
