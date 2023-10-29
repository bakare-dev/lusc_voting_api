

let instance;

class ElectionConstraint {

    constructor() {
        if (instance) return instance;

        instance = this;
    }
}

module.exports = ElectionConstraint;