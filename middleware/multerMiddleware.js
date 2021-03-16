import path from 'path';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import { v4 as uuid } from 'uuid';

// AWS Bucket config
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Multer storage configuration
const storage = multerS3({
  s3: s3,
  bucket: 'worldcleaner-storage',
  acl: 'public-read',
  region: 'us-east-2',
  contentType: function (req, file, cb) {
    cb(null, file.mimetype);
  },
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    cb(null, Date.now() + '-' + uuid() + path.extname(file.originalname));
  },
});

// File validation - only png and jpg allowed
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == 'image/png' ||
    file.mimetype == 'image/jpg' ||
    file.mimetype == 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error('Image format not valid'));
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 1200000 }, // 1.2 MB
  fileFilter: fileFilter,
});
