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
    static async GetMyWorkers(request, response, next) {
        try {
            let { branch_id } = await request.params

            let branch = await request.db.branches.findOne({
                where: {
                    branch_id
                }
            })

            if (!branch) throw new response.error(404, "Branch not found!")

            let workers = await request.db.workers.findAll({
                where: {
                    branch_id
                },
                include: {
                    model: request.db.branches
                }
            })

            if (!workers.length) throw new response.error(404, 'Workers not found!')

            let workersData = []

            for (let worker of workers) {
                let user = await request.db.users.findOne({
                    where: {
                        user_id: worker.user_id
                    }
                })

                workersData.push({
                    worker_id: worker.worker_id,
                    user,
                    createdAt: worker.createdAt,
                    updatedAt: worker.updatedAt,
                    branch_id: worker.branch_id,
                    branch: worker.branch
                })
            }

            response.status(200).json({
                ok: true,
                message: "Branches created successfully!",
                data: {
                    workers: workersData
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