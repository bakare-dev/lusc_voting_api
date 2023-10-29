const http = require("http");
const https = require("https");
const Helper = require("./Helper");

let instance;
class HttpClient {

    #helper;

    constructor(){

        if(instance) return instance;
        this.#helper = new Helper()

        instance = this;
    }


    request = async  (clientOptions, data, secure, callback) => {

       
        
        let encodedData = JSON.stringify(data);
        
        let httpClient = secure ? https : http;

        let options = {
            headers: {
                'Content-Type' : 'application/json',
                'Content-Length': encodedData?.length > 0 ? encodedData?.length : 0
            }
        }

        

        options = {...options, ...clientOptions};


        let req = httpClient.request(options, res => {

            let rawData = [];
            let responseBody;

            res.setEncoding('utf-8');

            res.on("data", chunk => {
                rawData.push(chunk)
            })
            
            res.on('end', () => {
                responseBody = JSON.parse(rawData);
                callback({status: res.statusCode, data: responseBody});
            });

            res.on("error", (error) => {
                this.#helper.logError(error);
                callback({status: 500, data: error});
            })

        })

        req.on('error', e => {
            callback({status: 500, message: e});
        })

        req.write(JSON.stringify(data));
    }


}

module.exports = HttpClient;