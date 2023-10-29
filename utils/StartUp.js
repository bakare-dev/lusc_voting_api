const Helper = require("./Helper");
const CategoryService = require("../services/CategoryService");

let instance;

class StartUp { 

    #helper;
    #categoryService;

    constructor () {
        if (instance) return instance;

        this.#helper = new Helper();
        this.#categoryService = new CategoryService();

        instance = this;
    }

    addCategory = async () => {
        try {
            const categories = [
                { category: "Leadership Award" },
                { category: "Social Impact Award" },
                { category: "Lecturer of the Year - CBSS" },
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
                    this.#helper.logError({message: "error occurred adding " + category.category});
                } else {
                    this.#helper.logInfo(category.category + " added")
                }
            }

            this.#helper.logInfo("done");
        } catch (ex) {
            this.#helper.logError(ex);
            process.exit(1);
        }
    }
}

module.exports = StartUp;