

let instance;

class ElectionConstraint {

    constructor() {
        if (instance) return instance;

        instance = this;
    }

    addVoteConstraint = () => {
        return {
            CategoryId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            VoterId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
            NomineeId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            }
        }
    }

    getVoterVotes = () => {
        return {
            voterId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
        }
    }

    addCategory = () => {
        return {
            category: {
                presence: true,
                length: {
                    minimum: 3
                }
            },
        }
    }

    addCategories = () => {
        return {
            categories: {
                presence: true,
                type: "array"
            },
        }
    }

    getCategoryVotes = () => {
        return {
            categoryId: {
                presence: true,
                numericality: {
                    onlyInteger: true,
                    greaterThan: 0
                }
            },
        }
    }

    addBulkVoteConstraint = () => {
        return {
            votes: {
                presence: true,
            },
        }
    }
}

module.exports = ElectionConstraint;