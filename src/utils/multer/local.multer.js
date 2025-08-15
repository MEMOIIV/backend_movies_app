import multer from "multer";
import path from "node:path";
import fs from "node:fs";

export const fileValidators = {
  image: ["image/png", "image/jpeg"],
  document: ["application/pdf", "application/msword"],
};
export function localFileUpload({
  customPath = "general",
  fileValidation = [],
} = {}) {
  let basePath = `upload/${customPath}`;
  let fullPath = path.resolve(`./src/${basePath}`);

  const storage = multer.diskStorage({
    // destination, // Where should the uploaded files be stored?
    // filename, // What should be the name of the saved file?

    destination: function (req, file, callback) {
      if (req.user?._id) {
        basePath += `/${req.user._id.toString()}`;
        fullPath = path.resolve(`./src/${basePath}`);
      }
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true }); // recursive true mean => if parent not exist created parent ("general/lol")
      }
      callback(null, fullPath);
    },

    filename: function (req, file, callback) {
      //   console.log({ file });
      const uniqueFileName =
        Date.now() + "_" + Math.random() + "_" + file.originalname;
      file.finalPath = basePath + "/" + uniqueFileName;
      callback(null, uniqueFileName);
      // originalname => name file and extension
    },
  });

  const fileFilter = (req, file, callback) => {
    // console.log({fileFilter : file});
    // console.log({
    //   fileValidation,
    //   result: !fileValidation.includes(file.mimetype),
    // });
    if (!fileValidation.includes(file.mimetype)) {
      return callback("inv-valid file format", false);
    }
    callback(null, true);
  };
  return multer({
    dest: "temp",
    fileFilter,
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
  });
  // test => temporary destination if i does not have storage
  // if i do not make fie=> upload the dest make file his name is temp
}
