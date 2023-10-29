"use strict"
const fs = require("fs").promises;
const path = require("path");

let instance;

class Helper {

    #errorlogFolderPath;
    #infologFolderPath;
    #httpsClient;


    constructor(){

        if(instance) return instance;

        this.#errorlogFolderPath = path.join(__dirname, '../Errorlogs');
        this.#infologFolderPath = path.join(__dirname, '../Infologs');

        instance = this;
    }

    paginate = (page, size) => {


        const pageInt = Number.parseInt(page);
        const sizeInt = Number.parseInt(size);


        let localPage = 0;
        let localSize = 50;

        if (!Number.isNaN(pageInt) && pageInt > 0) {
            localPage = pageInt;
        }

        if (!Number.isNaN(sizeInt) && sizeInt > 0 && sizeInt <= 50) {
            localSize = sizeInt
        }


        const offset = localPage * localSize;
        const limit = localSize;
      
        return {
          offset,
          limit,
        };
    }

    logError = async (error) => {
        const timestamp = new Date().toISOString();
        const date = new Date().getDate() + "-" + (new Date().getMonth()+1) + "-" + new Date().getFullYear()
        const logMessage = `[${timestamp}] ${error.message || JSON.stringify(error)}\n`; 

        try {
            await fs.mkdir(this.#errorlogFolderPath, { recursive: true });

            const logFilePath = path.join(this.#errorlogFolderPath, `${date}-errorlog.txt`);
            console.log(`+ error: ${logMessage}\n`);
            await fs.appendFile(logFilePath, logMessage, 'utf8');
        } catch (err) {
            console.error('Error writing to error.txt:', err);
        }
    }

    logInfo = async (info) => {
        const timestamp = new Date().toISOString();
        const date = new Date().getDate() + "-" + (new Date().getMonth()+1) + "-" + new Date().getFullYear()
        const logMessage = `+ info: ${info}\n`; 

        try {
            await fs.mkdir(this.#infologFolderPath, { recursive: true });

            const logFilePath = path.join(this.#infologFolderPath, `${date}-infolog.txt`);
            console.log(logMessage);
            await fs.appendFile(logFilePath, logMessage, 'utf8');
        } catch (err) {
            console.error('Error writing to error.txt:', err);
        }
    }
}


module.exports = Helper;