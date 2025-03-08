import multer from "multer";

// Read the documnetation

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // here using original name is bad as there can be many file with the same so the file will be overwrite. As it stays in server for very less amount of time that we can use this originalname
  },
});

export const upload = multer({ storage });
