const aws = require("aws-sdk");
const SDK = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
const dotenv = require("dotenv");
const multer = require("multer");

dotenv.config({
  path: "../config/config.env",
});

exports.s3Uploadv4 = async (file, id) => {
  const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_BUCKET_REGION,
  });

  if (file.mimetype.split("/")[0] === "application") {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/user-${id}/${Date.now().toString()}-${
        file.originalname
      }-invoice.pdf`,
      Body: file,
    };

    return await s3.upload(params).promise();
  }
};

const fileFilter = async (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "application") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

const storage = multer.memoryStorage();

exports.upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 10, files: 1 },
});
