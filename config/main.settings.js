require("dotenv").config();
module.exports = {
  server: {
    port: process.env.PORT,
    cron: process.env.CRON_JOB,
    domain: "https://ssa.bakare.tech"
  },
  infrastructure: {
    dateFormat: "YYYY-MM-DD hh:mm:ss",
    nodemailer: {
      host: process.env.NODEMAILER_HOST,
      port: process.env.NODEMAILER_PORT,
      username: process.env.NODEMAILER_USERNAME,
      password: process.env.NODEMAILER_PASSWORD,
    },
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USN,
      password: process.env.SMTP_PASSWORD,
    },
    s3: {
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_S3_REGION,
      accessKey: process.env.AWS_ACCESS_KEY,
      secretKey: process.env.AWS_SCERET_KEY,
    },
    ip: '196.223.x.x',
    timezone: "Africa/Lagos",
    cloudinary: {
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
      apiName: process.env.CLOUDINARY_API_NAME,
      apiUpload: process.env.CLOUDINARY_API_UPLOAD,
      cloudinaryUrl: process.env.CLOUDINARY_URL,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    },
    winston: {
      server: process.env.WINSTONSOURCESERVER,
      sourceToken: process.env.WINSTONSOURCETOKEN,
    },
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
