const CloudinaryService = require("../utils/CloudinaryService");
let instance;
class MediaService {
  #s3;
  #cloudinary;

  constructor() {
    if (instance) return instance;

    this.#cloudinary = new CloudinaryService();

    instance = this;
  }

  writeCloudinary = async (media) => {
    return await this.#cloudinary.write(media);
  };
}

module.exports = MediaService;
