let S3Bucket = require("aws-sdk/clients/s3");
let fs = require("fs");
let path = require("path");
const Helper = require("./Helper");
const { infrastructure } = require("../config/main.settings");

require("dotenv").config();

let instance;
class S3Storage {
  #s3;
  #helper;

  constructor() {
    if (instance) return instance;

    this.#s3 = new S3Bucket({
      region: infrastructure.s3.region,
      accessKeyId: infrastructure.s3.accessKey,
      secretAccessKey: infrastructure.s3.secretKey,
    });

    this.#helper = new Helper();

    instance = this;
  }

  write = async (data) => {
    try {
      let fileContent = fs.readFileSync(data);
      let filename = path.basename(data);

      const s3Response = await this.#s3
        .upload({
          Bucket: infrastructure.s3.bucket,
          Body: fileContent,
          Key: filename,
        })
        .promise();

      await this.#deleteFile(data);
      return s3Response;
    } catch (ex) {
      this.#helper.logError(ex);
    }
  };

  delete = async (key) => {
    try {
      const s3Response = await this.#s3
        .deleteObject({
          Bucket: infrastructure.s3.bucket,
          Key: key,
        })
        .promise();
      return s3Response;
    } catch (ex) {
      this.#helper.logError(ex);
    }
  };

  #deleteFile = async (filePath) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        this.#helper.logError(err);
        return;
      } else {
        return;
      }
    });
  };
}

module.exports = S3Storage;
