import { ErrorHandler } from "../helpers/handleError.js";
import {Validations} from "../modules/validations.js";
import pkg from 'sequelize'
const { Op } = pkg

export default class CategoriesController {
    static async AddNewCategory(request, response, next) {
        try {
            const { categories } = await request.body

            let findBranches = await request.db.branches.findAll({
                where: {
                    branch_owner: request.owner.user_id
                },
                attributes: ["branch_id"],
                raw: true
            })

            if (!findBranches.length) throw new response.error(404, "Your branches not found!")

            for (let cat of categories) {
                await request.db.categories.create({
                    category_name: cat.category_name,
                    branch_id: cat.branch_id,
                    category_id: cat.category_id
                })
            }

            response.status(200).json({
                ok: true,
                message: "Categories created successfully!"
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

            let category = await request.db.categories.findOne({
                where: {
                    category_id
                }
            })

            if (!category) throw new response.error(404, "Category not found!")

            let products = await request.db.products.findAll({
                where: {
                    category_id
                },
                include: {
                    model: request.db.categories
                }
            })

            response.status(200).json({
                ok: true,
                data: {
                    products
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