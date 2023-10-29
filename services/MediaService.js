let S3Storage = require("../utils/S3Storage");

let instance;
class MediaService {

  #s3;

  constructor() {
    if (instance) return instance;

    this.#s3 = new S3Storage();

    instance = this;
  }

  write = async (media) => {
    return await this.#s3.write(media);
  };

  delete = async (key) => {
    return await this.#s3.delete(key)
  }
}

module.exports = MediaService;
