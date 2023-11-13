const multer = require("multer");
const fileTypes = require("../constants/fileTypes");
const path = require("path");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (file) {
      const extension = path.extname(file.originalname);

      if (fileTypes.includes(extension)) {
        console.log("It worked");
        callback(null, true);
      } else {
        callback(null, false);
      }
    } else {
      callback("No file found", false);
    }
  },
});

module.exports = upload;
