"use strict";
const config = require("../config/main.settings")
const { Sequelize } = require('sequelize');
const Helper = require("./Helper");
const Logger = require("./Logger");


let instance;

class DatabaseEngine {

    #connectionManager;
    
    #logger;

    constructor() {

        if (instance) return instance;

        this.#logger = new Logger().getLogger();

        this.#connectionManager = new Sequelize(config.database.development.database, config.database.development.username, config.database.development.password, {
            host: config.database.development.host,
            dialect: config.database.development.dialect,
            logging: false
        });

        instance = this;
    }

    connect = async (cb) => {
        try {
            await this.#connectionManager.authenticate();
            await this.#synchronize();
            cb();
        } catch (e) {
            this.#logger.error(e);
        }
    }

    #synchronize = async () => {
        try {

            const db = {};

            db.Vote = require("../entities/Vote");
            db.Voter = require("../entities/Voter");
            db.Admin = require("../entities/Admin");
            db.Nominee = require("../entities/Nominee");
            db.Category = require("../entities/Category");
            db.Associate = require("../entities/Associate");

            this.#connectionManager.db = db;

            await this.#connectionManager.sync({alter: true});

        } catch (e) {
            this.#logger.error(e);
        }
    }

    getConnectionManager = () => this.#connectionManager;
}

module.exports = DatabaseEngine;