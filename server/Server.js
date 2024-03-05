"use strict";

const express = require("express");
const IPRestriction = require("../utils/IpRestriction");
const Helper = require("../utils/Helper");
const path = require("path");

/* routes */
const mediaRoute = require("./routes/mediaRoute");
const electionRoute = require("./routes/electionRoute");
const userRoute = require("./routes/userRoute");
const Logger = require("../utils/Logger");

let instance;
class Server {
  #app;
  #port;
  #ipRestriction;
  #logger;
  #ipRequestCount = new Map();
  #rateLimitWindowMs = 30000;
  #maxRequestsPerWindow = 10;

  constructor(port) {
    if (instance) return instance;

    this.#port = port;
    this.#ipRestriction = new IPRestriction();
    this.#logger = new Logger().getLogger();
    this.#configure();
    this.#buildRoutes();

    instance = this;
  }

  #checkRateLimit = (req, res, next) => {
    const ip = req.ip;
    const currentTime = Date.now();
    const ipRequests = this.#ipRequestCount.get(ip) || [];
    this.#ipRequestCount.set(ip, ipRequests);

    this.#ipRequestCount.set(
      ip,
      ipRequests.filter(
        (timestamp) => currentTime - timestamp < this.#rateLimitWindowMs
      )
    );

    if (ipRequests.length > this.#maxRequestsPerWindow) {
      return res.status(429).json({ error: "Try Again Later" });
    }

    ipRequests.push(currentTime);

    next();
  };

  #configure = () => {
    this.#app = express();
    this.#app.use(express.json({ limit: "50mb" }));
    this.#app.set("view engine", "ejs");
    this.#app.set("trust proxy", true);

    this.#app.use(
      "/static",
      express.static(path.join(__dirname + "../../tempfiles"))
    );

    this.#app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,PUT");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, source, auth_mode"
      );
      res.setHeader("Access-Control-Allow-Credentials", "true");

      if (req.method === "OPTIONS") {
        return res.sendStatus(200);
      }
      next();
    });

    this.#app.use(this.#ipRestriction.restrictToIPAddress);
    this.#app.use(this.#checkRateLimit);
  };

  #buildRoutes = () => {
    this.#app.use("/api/v1/media", mediaRoute);
    this.#app.use("/api/v1/election", electionRoute);
    this.#app.use("/api/v1/user", userRoute);

    this.#app.get("/association/:id", (req, res) => {
      const id = req.params.id;
      res.render("form", { id });
    });

    this.#app.get("/health", (req, res) => {
      res.status(200).json({
        message: "voting server is running fine",
      });
    });

    this.#app.get("/", (req, res) => {
      res.status(200).json({
        message: "you have reached votind server",
        swagger: "/swagger",
        api: "/api/v1",
        health: "/health",
      });
    });
  };

  start = () => {
    this.#app.listen(this.#port, () => {
      this.#logger.info("voting server is up at port " + this.#port)
    });
  };

  getServerApp = () => {
    return this.#app;
  };
}

module.exports = Server;
