const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

let gfs;

const connectGridFS = (mongooseConnection) => {
  gfs = Grid(mongooseConnection.db, mongoose.mongo);
  gfs.collection('uploads'); // Name of the collection to store files
};

const uploadFile = (req, res) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const writestream = gfs.createWriteStream({
    filename: file.originalname,
    content_type: file.mimetype
  });

  writestream.on('close', (file) => {
    res.status(200).json({
      file: {
        filename: file.filename,
        contentType: file.contentType
      }
    });
  });

  writestream.write(file.buffer);
  writestream.end();
};

const getFile = (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ msg: 'No file exists' });
    }

    const readstream = gfs.createReadStream({ filename: file.filename });
    readstream.pipe(res);
  });
};

module.exports = {
  connectGridFS,
  uploadFile,
  getFile
};
