require("dotenv").config();
module.exports = {
  server: {
    port: process.env.PORT,
  },
  infrastructure: {
    dateFormat: "YYYY-MM-DD hh:mm:ss",
    clientUrl: "",
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USN,
      password: process.env.SMTP_PASSWORD,
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
  },
};
