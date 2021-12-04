import Joi from "joi";

export class Validations {
    static async UserCreateAccountValidation() {
        return Joi.object({
            user_name: Joi.string()
                .required()
                .error(new Error("Name is invalid"))
                .min(2)
                .max(64),
            user_phone: Joi.string()
                .error(Error("Phone number is invalid"))
                .pattern(/^998[389][012345789][0-9]{7}$/),
            brand_name: Joi.string()
                .required()
                .error(new Error("Name is invalid"))
                .min(2)
                .max(64),
        });
    }
    static async UserLoginAccountValidation() {
        return Joi.object({
            user_phone: Joi.string()
                .error(Error("Phone number is invalid"))
                .pattern(/^998[389][012345789][0-9]{7}$/),
        });
    }
    static async UserValidateCodeValidation() {
        return Joi.object({
            code: Joi.number()
                .required()
                .min(10000)
                .max(99999)
                .error(Error("Invalid code!"))
        })
    }
}