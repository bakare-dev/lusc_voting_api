const Server = require("./server/Server");
const DatabaseEngine = require("./utils/DatabaseEngine");
const Helper = require("./utils/Helper");
const { server } = require("./config/main.settings");
const StartUp = require("./utils/StartUp");

const helper = new Helper();
const startUp = new StartUp();

main = () => {
    try {
        let serverEngine = new Server(server.port);
        serverEngine.start();
        
        // const db = new DatabaseEngine();

        // db.connect( async () => {
        //     let serverEngine = new Server(server.port);
        //     await startUp.addCategory();
        //     await startUp.addNominee(); 
        //     serverEngine.start();
        // });
    } catch (e) {
        helper.logError(e)
        process.exit(1);
    }
};

main();
