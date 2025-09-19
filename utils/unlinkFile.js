const fs = require("fs");
const path = require("path");
const unlinkFile = (fileName, filePath) => {
  if (fileName) {
    const fullPath = path.join(
      __dirname,
      "../public/images",
      filePath,
      fileName
    );
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${err}`);
      } else {
        console.log(`File deleted successfully: ${fileName}`);
      }
    });
  }
};
module.exports = unlinkFile;
