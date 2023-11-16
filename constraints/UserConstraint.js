
let instance;

class UserConstraints {

    constructor() {
        if (instance) return instance;
 
        instance = this;
    }

    userRegistrationConstraint = () => {
        return {
            emailAddress: {
                presence: true,
                email: true
            },
            matricNo: {
                presence: true,
                length: {
                    minimum: 7
                }
            },
        }
    }

    userValidationConstraint = () => {
        return {
            key: {
                presence: true,
                length: {
                    minimum: 12,
                    message: "access forbidden"
                }
            },
        }
    }
}

module.exports = UserConstraints;