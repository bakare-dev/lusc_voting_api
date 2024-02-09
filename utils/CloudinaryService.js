const fs = require("fs");
const path = require("path");
const { infrastructure } = require("../config/main.settings");
const cloudinary = require("cloudinary").v2;

let instance;
class CloudinaryService {
  #options;

  constructor() {
    if (instance) return instance;

    cloudinary.config({
      cloud_name: infrastructure.cloudinary.cloudName,
      api_key: infrastructure.cloudinary.apiKey,
      api_secret: infrastructure.cloudinary.apiSecret,
      secure: true,
    });

    this.#options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    instance = this;
  }

  write = async (data) => {
    try {
      const cloudinaryResp = await cloudinary.uploader.upload(
        data,
        this.#options
      );

      await this.#deleteFile(data);
      return cloudinaryResp;
    } catch (ex) {
      console.log(ex);
      return { error: "internal server error" };
    }
  };

  #deleteFile = async (filePath) => {
    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      console.log(err);
    }
  };
}

module.exports = CloudinaryService;
