const Server = require("./server/Server");
const DatabaseEngine = require("./utils/DatabaseEngine");
const { server, infrastructure } = require("./config/main.settings");
const StartUp = require("./utils/StartUp");
const Logger = require("./utils/Logger");

const logger = new Logger().getLogger();
const startUp = new StartUp();

main = () => {
    try {
        process.env.TZ = infrastructure.timezone;
        let serverEngine = new Server(server.port);
        serverEngine.start();
        
        // const db = new DatabaseEngine();

        // db.connect( async () => {
        //     let serverEngine = new Server(server.port);
        //     await startUp.addCategory();
        //     serverEngine.start();
        // });
    } catch (e) {
        logger.error(e)
        process.exit(1);
    }
};

main();
