const express = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const app = express();
dotenv.config();
const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

const myBucket = "pethowz-local";
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: myBucket,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});
app.get("/", (req, res) => res.send("server"));

//single file upload
app.post("/single", upload.single("image"), (req, res) => {
  res.send("single file uploaded");
});
//multiple file upload
app.post("/multiple", upload.array("image", 40), (req, res) => {
  res.send(`multiple file uploaded.total files:${req.files.length}`);
});
app.listen("3000", () => console.log("server is running"));
