const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const MediaController = require("../../controllers/MediaController");
const controller = new MediaController()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname + `../../../tempfiles`));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + "-" + Date.now() + ext;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("file"), controller.upload);

router.delete("/:key", controller.delete);

module.exports = router;
