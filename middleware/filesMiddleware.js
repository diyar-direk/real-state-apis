const multer = require("multer");
const fs = require("fs");
const path = require("path");

function createUploader(folderPath = "uploads") {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, folderPath);
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const filename = `${Date.now()}-${file.originalname.replace(
        /\s+/g,
        "-"
      )}`;
      cb(null, filename);
    },
  });

  const fileFilter = (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase();
    if ([".png", ".jpg", ".jpeg"].includes(fileExt)) cb(null, true);
    else cb(new Error("Only .png, .jpg, .jpeg format allowed!"), false);
  };

  return multer({
    storage,
    fileFilter,
  });
}

module.exports = createUploader;
