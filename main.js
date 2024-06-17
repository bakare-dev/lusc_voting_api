const Server = require("./server/Server");
const DatabaseEngine = require("./utils/DatabaseEngine");
const { server, infrastructure } = require("./config/main.settings");
const Logger = require("./utils/Logger");

const logger = new Logger().getLogger();

main = () => {
    try {
        let serverEngine = new Server(server.port);
        serverEngine.start();

        // const db = new DatabaseEngine();

        // db.connect( async () => {
        //     let serverEngine = new Server(server.port);
        //     serverEngine.start();
        // });
    } catch (e) {
        logger.error(e)
        process.exit(1);
    }
};

main();
