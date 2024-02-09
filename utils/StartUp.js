
const CategoryService = require("../services/dataServices/CategoryService");
const Logger = require("./Logger");

let instance;

class StartUp { 

    #logger;
    #categoryService;

    constructor () {
        if (instance) return instance;

        this.#logger = new Logger().getLogger();
        this.#categoryService = new CategoryService();

        instance = this;
    }

    addCategory = async () => {
        try {
            const categories = [
                { category: "Leadership Award" },
                { category: "Social Impact Award" },
                { category: "Lecturer of the Year - CBS" },
                { category: "Lecturer of the Year - CPAS" },
                { category: "Lecturer of the Year - COE" },
                { category: "Lecturer of the Year - CAS" },
                { category: "Student of the Year (ICON 360)" },
                { category: "Entrepreneur of the Year" },
                { category: "Brand of the Year" },
                { category: "Tech-savvy of the Year" },
                { category: "Comedian of the Year" },
                { category: "Musician of the Year" },
                { category: "Dancer of the Year" },
                { category: "Actor of the Year" },
                { category: "Athlete of the Year" },
                { category: "Photographer of the Year" },
                { category: "Artist of the Year" },
                { category: "Graphic Designer of the Year" },
                { category: "Videographer of the Year" },
                { category: "Agripreneur of the Year" },
                { category: "Model of the Year" },
                { category: "SM Influencer of the Year" },
                { category: "Content Creator of the Year" },
                { category: "Fashion Designer of the Year" },
            ]

            for ( const category of categories ) {
                const serviceResponse = await this.#categoryService.create(category);

                if (!serviceResponse.id) {
                    this.#logger.error("error occurred adding " + category.category);
                } else {
                    this.#logger.info(category.category + " added")
                }
            }

            this.#logger.info("done");
        } catch (ex) {
            this.#logger.error(ex);
            process.exit(1);
        }
    }
}

module.exports = StartUp;