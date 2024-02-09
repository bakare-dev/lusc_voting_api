const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const MediaService = require("../../services/MediaService");

const mediaService = new MediaService();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname + `../../../tempFiles`));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + "-" + Date.now() + ext;
    cb(null, name);
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const response = await mediaService.writeCloudinary(req.file.path);

    res.status(200).json({url: response.url});
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ error: "internal server error" });
  }
});

module.exports = router;
