
const CategoryService = require("../services/dataServices/CategoryService");
const AssociationService = require("../services/dataServices/AssociationService");
const Logger = require("./Logger");

let instance;

class StartUp { 

    #logger;
    #categoryService;
    #associationService;

    constructor () {
        if (instance) return instance;

        this.#logger = new Logger().getLogger();
        this.#categoryService = new CategoryService();
        this.#associationService = new AssociationService();

        instance = this;
    }

    addCategory = async () => {
        try {
            const association = await this.#associationService.create({
                title: "NACOS",
                code: "CD"
            })

            if (!association.id) {
                this.#logger.error("error occurred adding association");
                process.exit(1);
            }

            const categories = [
                { category: "President", AssociateId: association.id},
                { category: "Vice President", AssociateId: association.id},
                { category: "General Secretary", AssociateId: association.id},
                { category: "Public Relation Officer (Female)", AssociateId: association.id},
                { category: "Public Relation Officer (Male)", AssociateId: association.id},
                { category: "Academic Director", AssociateId: association.id},
                { category: "Technical Director", AssociateId: association.id},
                { category: "Financial Secretary", AssociateId: association.id},
                { category: "Welfare Secretary (Male)", AssociateId: association.id},
                { category: "Welfare Secretary (Female)", AssociateId: association.id},
                { category: "Chaplain (Female)", AssociateId: association.id},
                { category: "Chaplain (Male)", AssociateId: association.id},
                { category: "Social Director (Female)", AssociateId: association.id},
                { category: "Social Director (Male)", AssociateId: association.id},
                { category: "Sport Director (Female)", AssociateId: association.id},
                { category: "Sport Director (Male)", AssociateId: association.id},
            ]

            for ( const category of categories ) {
                const serviceResponse = await this.#categoryService.create(category);

                if (!serviceResponse.id) {
                    this.#logger.error("error occurred adding " + category.category);
                    process.exit(1);
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