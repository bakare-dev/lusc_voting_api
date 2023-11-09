const Helper = require("./Helper");
const CategoryService = require("../services/CategoryService");
const NomineeService = require("../services/NomineeService");

let instance;

class StartUp { 

    #helper;
    #categoryService;
    #nomineeService;

    constructor () {
        if (instance) return instance;

        this.#helper = new Helper();
        this.#categoryService = new CategoryService();
        this.#nomineeService = new NomineeService();

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

            const nominees = [
                { 
                    firstName: "Okene",
                    lastName: "Womzy", 
                    matricNo: "20CD007562",
                    emailAddress: "bakare.praise@lmu.edu.ng",
                    pictureUrl: "http://locahost:8010"
                }
            ]

            for ( const category of categories ) {
                const serviceResponse = await this.#categoryService.create(category);

                if (!serviceResponse.id) {
                    this.#helper.logError({message: "error occurred adding " + category.category});
                } else {
                    this.#helper.logInfo(category.category + " added")
                }
            }

            for ( const nominee of nominees ) {
                const serviceResponse = await this.#nomineeService.create(nominee);

                if (!serviceResponse.id) {
                    this.#helper.logError({message: "error occurred adding " + nominee.matricNo});
                } else {
                    this.#helper.logInfo(nominee.matricNo + " added")
                }
            }

            this.#helper.logInfo("done");
        } catch (ex) {
            this.#helper.logError(ex);
            process.exit(1);
        }
    }

    addNominee = async () => {
        try {
            const nominees = [
                { 
                    firstName: "Okene",
                    lastName: "Womzy", 
                    matricNo: "20CD007562",
                    CategoryId: 1,
                    emailAddress: "okene.womzy@lmu.edu.ng",
                    pictureUrl: "http://locahost:8010"
                }
            ]

            for ( const nominee of nominees ) {
                const serviceResponse = await this.#nomineeService.create(nominee);

                if (!serviceResponse.id) {
                    console.log(serviceResponse)
                    this.#helper.logError({message: "error occurred adding " + nominee.matricNo});
                } else {
                    this.#helper.logInfo(nominee.matricNo + " added")
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