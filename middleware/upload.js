const multer = require("multer");
const path = require("path");

// const storage = multer.diskStorage({
//   destination: "./uploads",
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(/\s+/g, "-")
    );
  },
});

const upload = multer({ storage });

module.exports = upload;