"use strict";

const express = require("express");
const IPRestriction = require("../utils/IpRestriction");
const Helper = require("../utils/Helper");
const path = require("path");

/* routes */
const mediaRoute = require("./routes/mediaRoute");
const electionRoute = require("./routes/electionRoute");
const userRoute = require("./routes/userRoute");

let instance;
class Server {
  #app;
  #port;
  #ipRestriction;
  #helper

  constructor(port) {
    if (instance) return instance;

    this.#port = port;
    this.#ipRestriction = new IPRestriction();
    this.#helper = new Helper()
    this.#configure();
    this.#buildRoutes();

    instance = this;
  }

  #configure = () => {
    this.#app = express();
    this.#app.use(express.json({ limit: "50mb" }));
    this.#app.set("view engine", "ejs");

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
        return res.sendStatus(200);x
      }
      next();
    });
  };

  #buildRoutes = () => {

    this.#app.use("/api/v1/media", mediaRoute);
    this.#app.use("/api/v1/election", electionRoute);
    this.#app.use("/api/v1/user", userRoute);

    this.#app.get("/nominee/:id", (req, res) => {
      const id = req.params.id;
      res.render("form", { id });
    })

    this.#app.get("/health", (req, res) => {
      res.status(200).json({
        message: "lusc skilled award server is running fine",
      });
    });

    this.#app.get("/", (req, res) => {
      res.status(200).json({
        message: "you have reached lusc skilled award server",
        swagger: "/swagger",
        api: "/api/v1",
        health: "/health",
      });
    });
  };

  start = () => {
    this.#app.listen(this.#port, () => {
      this.#helper.logInfo("lusc skilled award server is up at port " + this.#port)
    });
  };

  getServerApp = () => {
    return this.#app;
  };
}

module.exports = Server;
