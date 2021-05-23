const express = require("express");
const bodyParser = require("body-parser");
var path = require("path");
var busboy = require("connect-busboy"); //middleware for form/file upload
const cors = require("cors");
const app = express();

app.use(cors());
// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(busboy());
app.use(express.static(path.join(__dirname, "public")));

const uploadPicture = (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  let fs = require("fs");
  let fstream;
  req.pipe(req.busboy);
  req.busboy.on("file", function (fieldname, file, filename) {
    console.log("Uploading: " + filename);
    //Path where image will be uploaded
    fstream = fs.createWriteStream(`./images/` + filename + ".jpg");
    file.pipe(fstream);
    fstream.on("close", function () {
      console.log("Upload Finished of " + filename);
      res.redirect("back"); //where to go next
    });
  });
};

const deletePictures = (req, res) => {
  let fs = require("fs");
  console.log(req);
  for (let id of req.body.ids) {
    fs.unlink(`./images/` + id + ".jpg", (error) => {
      console.log(error);
    });
  }
  res.redirect("back");
};

app.get("/", function (req, res) {
  const fs = require("fs");
  const file = `/images/${req.query.image}`;
  if (fs.existsSync(__dirname + file)) {
    res.sendFile(__dirname + file); // Set disposition and send it.
  } else {
    res.sendFile(__dirname + "/images/no-image.png");
  }
});

app.post("/", function (req, res) {
  uploadPicture(req, res);
});

app.delete("/", function (req, res) {
  deletePictures(req, res);
});

app.listen(9000);
