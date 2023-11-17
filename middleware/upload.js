const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3()


const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'mayfly-bucket',
    acl: 'public-read', 
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const filename = Date.now().toString() + '-' + file.originalname;
      const key = filename;
      cb(null, key);
    },
  }),
});

module.exports = upload