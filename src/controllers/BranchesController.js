import { ErrorHandler } from "../helpers/handleError.js";
import {Validations} from "../modules/validations";

export default class BranchesController {
    static async AddNewBranch(request, response, next) {
        try {
            const { branch_name, branch_description, branch_longitude, branch_latitude } = await (
                await Validations.AddNewBranchValidation()
            ).validateAsync(request.body);



            response.status(200).json({
                ok: true
            });
        } catch (error) {
            if (!error.statusCode)
                error = new response.error(400, "Invalid inputs");
            next(error)
        }
    }
}