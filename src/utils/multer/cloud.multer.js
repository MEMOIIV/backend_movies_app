import multer from "multer";


export const fileValidators = {
  image: ["image/png", "image/jpeg"],
  document: ["application/pdf", "application/msword"],
};
export function cloudFileUpload({fileValidation = [],} = {}) {
 
    const storage = multer.diskStorage({})

  const fileFilter = (req, file, callback) => {
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
