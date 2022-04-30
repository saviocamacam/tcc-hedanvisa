const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const path = require('path');
const config = require('../config/database');

const mongoURI = process.env.MONGODB_URI || process.env.MONGOHQ_URL || config.database;

const { checkTokenMiddleware } = require('../utils/authService');

const conn = mongoose.createConnection(mongoURI);

let gfs;

conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, buf) => {
      if (err) {
        return reject(err);
      }
      const filename = buf.toString('hex') + path.extname(file.originalname);
      const fileInfo = {
        filename,
        bucketName: 'uploads',
        metadata: req.body.metadata,
        // metadata: {
        //   originalname: file.originalname,
        //   owner: req.decoded.user.mainProfile,
        // },
      };
      resolve(fileInfo);
    });
  }),
});
const upload = multer({
  storage,
});

router.post(
  '/upload',
  checkTokenMiddleware,
  upload.single('file'),
  (req, res) => {
    try {
      res.status(201).json({
        success: true,
        message: 'The file as been uploaded.',
        data: {
          file: req.file,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        error,
      });
    }
  },
);

router.post(
  '/uploadSchoolYearAttachment',
  checkTokenMiddleware,
  upload.single('file'),
  async (req, res) => {
    try {
      res.status(201).json({
        success: true,
        message: 'The file as been uploaded.',
        data: {
          file: req.file,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        error,
      });
    }
  },
);

router.get('/image/:filename', async (req, res) => {
  try {
    const file = await gfs.files.findOne({
      filename: req.params.filename,
    });
    if (!file) {
      res.status(404).json({
        success: false,
        message: 'Not files exist',
      });
    }
    if (
      file.contentType === 'image/jpeg'
      || file.contentType === 'image/png'
      || file.contentType === 'image/jpg'
    ) {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        success: false,
        message: 'Not an image',
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

router.get('/', checkTokenMiddleware, async (req, res) => {
  const files = await gfs.files.find().toArray();
  if (!files || files.length === 0) {
    res.status(404).json({
      success: false,
      message: 'Not files exist',
    });
  }
  res.status(200).json({
    success: true,
    message: 'Files has found.',
    data: {
      files,
    },
  });
});

router.get('/pdf/:filename', async (req, res) => {
  try {
    const file = await gfs.files.findOne({
      filename: req.params.filename,
    });
    if (!file) {
      res.status(404).json({
        success: false,
        message: 'Not files exist',
      });
    }
    if (file.contentType === 'application/pdf') {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        success: false,
        message: 'Not an PDF',
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

module.exports = router;
