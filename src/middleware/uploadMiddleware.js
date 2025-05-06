const  multer = require('multer');
const path = require('path');
const os = require('os');

const storage = multer.diskStorage({
    destination: os.tmpdir(), 
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  });
const upload = multer({ storage });

module.exports = upload;