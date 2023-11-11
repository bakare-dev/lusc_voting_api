const Service = require("../services/MediaService");
const Helper = require("../utils/Helper");

let instance;

class MediaController {

    #service;
    #helper;

    constructor() {
        if(instance) return instance;

        this.#helper = new Helper();
        this.#service = new Service();

        instance = this;
    }

    upload = async (req, res) => {
        try {
            res.status(200).json({url: `https://sa.bakre.tech/static/${req.file.filename}`, status: 200});
        } catch (ex) {
            this.#helper.logError(ex);
            res.status(500).json({error: "internal server error", status: 500})
        }
    }

    delete = async (req, res) => {
        try {
            const response = await this.#service.delete(req.params.key);

            res.status(200).json({message: "deleted successfully"});
        } catch (ex) {
          this.#helper.logError(ex);
          res.status(500).json({error: "internal server error"});
        }
    }
}


module.exports = MediaController;
