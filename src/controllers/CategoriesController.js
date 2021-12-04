import { ErrorHandler } from "../helpers/handleError.js";
import {Validations} from "../modules/validations.js";
import pkg from 'sequelize'
const { Op } = pkg

export default class CategoriesController {
    static async AddNewCategory(request, response, next) {
        try {
            const { category_name } = await request.body

            let category = await request.db.categories.findOne({
                where: {
                    [Op.and]: [
                        {
                            category_name
                        },
                        {
                            branch_id: request.params.branch_id
                        }
                    ]
                }
            })

            let findBranches = await request.db.branches.findAll({
                where: {
                    branch_owner: request.owner.user_id
                },
                attributes: ["branch_id"],
                raw: true
            })

            if (!findBranches.length) throw new response.error(404, "Your branches not found!")

            let isExist = findBranches.filter(e => e.branch_id === request.params.branch_id)

            if (!isExist.length) throw new response.error(404, 'Your branch not found!')

            if (category) throw new response.error(405, "This category already exists!")

            let newCategory = await request.db.categories.create({
                category_name,
                branch_id: request.params.branch_id
            })

            response.status(200).json({
                ok: true,
                message: "Categories created successfully!",
                data: {
                    category: newCategory
                }
            });
        } catch (error) {
            console.log(error)
            if (!error.statusCode)
                error = new response.error(400, "Invalid inputs");
            next(error)
        }
    }
    static async GetCategories(request, response, next) {
        try {
            let { branch_id } = await request.params

            let branch = await request.db.branches.findOne({
                where: {
                    branch_id
                }
            })

            if (!branch) throw new response.error(404, `This branch doesn't exist!`)

            let categories = await request.db.categories.findAll({
                where: {
                    branch_id
                }
            })

            response.status(200).json({
                ok: true,
                data: {
                    branch,
                    categories
                }
            });
        } catch (error) {
            console.log(error)
            if (!error.statusCode)
                error = new response.error(400, "Invalid inputs");
            next(error)
        }
    }
    static async GetProductsByCategory(request, response, next) {
        try {
            let { category_id } = await request.params



            response.status(200).json({
                ok: true,
                data: {

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