const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "UPLOADS");
  },
  filename: function (req, file, cb) {
    cb(null, `image ${req.body.name}.jpg`);
  },
});
const upload = multer({ storage: storage });
function fileFilter(req, file, cb) {
  if (file.mimetype === "image/png" || "image/jpg" || "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
}
const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return "0 bytes";
  }
  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]
  );
};
module.exports = { upload, fileSizeFormatter };
