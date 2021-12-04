import { ErrorHandler } from "../helpers/handleError.js";
import {Validations} from "../modules/validations.js";

export default class BranchesController {
    static async AddNewBranch(request, response, next) {
        try {
            const { branches } = await request.body

            for (let branch of branches) {
                await request.db.branches.create({
                    branch_name: branch.branch_name,
                    branch_description: branch.branch_description,
                    branch_longitude: branch.branch_longitude,
                    branch_latitude: branch.branch_latitude,
                    branch_owner: request.owner.user_id
                })
            }

            let branchesData = await request.db.branches.findAll({
                where: {
                    branch_owner: request.owner.user_id
                }
            })

            response.status(200).json({
                ok: true,
                message: "Branches created successfully!",
                data: {
                    branches: branchesData
                }
            });
        } catch (error) {
            console.log(error)
            if (!error.statusCode)
                error = new response.error(400, "Invalid inputs");
            next(error)
        }
    }
    static async GetMyBranches(request, response, next) {
        try {
            let branchesData = await request.db.branches.findAll({
                where: {
                    branch_owner: request.owner.user_id
                }
            })

            response.status(200).json({
                ok: true,
                message: "Branches created successfully!",
                data: {
                    branches: branchesData
                }
            });
        } catch (error) {
            console.log(error)
            if (!error.statusCode)
                error = new response.error(400, "Invalid inputs");
            next(error)
        }
    }
}