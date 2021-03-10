import path from 'path';
import multer from 'multer';
import { v4 as uuid } from 'uuid';

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../public/assets/images/');
  },
  filename: (req, file, cb) => {
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
