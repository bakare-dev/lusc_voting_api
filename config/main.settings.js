require("dotenv").config();
module.exports = {
  server: {
    port: process.env.PORT,
    cron: process.env.CRON_JOB,
  },
  infrastructure: {
    dateFormat: "YYYY-MM-DD hh:mm:ss",
    nodemailer: {
      host: process.env.NODEMAILER_HOST,
      port: process.env.NODEMAILER_PORT,
      username: process.env.NODEMAILER_USERNAME,
      password: process.env.NODEMAILER_PASSWORD,
    },
    s3: {
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_S3_REGION,
      accessKey: process.env.AWS_ACCESS_KEY,
      secretKey: process.env.AWS_SCERET_KEY,
    },
    ip: process.env.IP
  },
  database: {
    development: {
      database: process.env.DEV_DB,
      username: process.env.DEV_USER,
      password: process.env.DEV_PASSWORD,
      host: process.env.DEV_HOST,
      dialect: "mysql",
      logging: false,
    },
    production: {},
  },
  security: {
    jwt: process.env.jwt,
    crypto: process.env.crypto,
  },
};
