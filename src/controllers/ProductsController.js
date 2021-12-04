import { ErrorHandler } from "../helpers/handleError.js";
import {Validations} from "../modules/validations.js";
import pkg from 'sequelize'
const { Op } = pkg

export default class ProductsController {
    static async AddNewProduct(request, response, next) {
        try {
            const { product_name, product_price, product_barcode, product_count, product_type } = await request.body
            const { category_id } = await request.params

            let category = await request.db.categories.findOne({
                where: {
                    category_id
                }
            })

            if (!category) throw new response.error(404, 'Category not found!')

            let product = await request.db.products.create({
                product_name,
                product_price,
                product_barcode,
                product_count,
                product_type,
                category_id
            })

            response.status(200).json({
                ok: true,
                message: "Product created successfully!",
                data: {
                    product
                }
            });
        } catch (error) {
            console.log(error)
            if (!error.statusCode)
                error = new response.error(400, "Invalid inputs");
            next(error)
        }
    }
    static async GetProductById(request, response, next) {
        try {
            let { product_id } = await request.params

            let product = await request.db.products.findOne({
                where: {
                    product_id
                },
                include: {
                    model: request.db.categories
                }
            })

            if (!product) throw new response.error(404, `This product doesn't exist!`)

            response.status(200).json({
                ok: true,
                data: {
                    product
                }
            });
        } catch (error) {
            console.log(error)
            if (!error.statusCode)
                error = new response.error(400, "Invalid inputs");
            next(error)
        }
    }
    static async GetProductsByBranch(request, response, next) {
        try {
            const { branch_id } = await request.params

            let branch = await request.db.branches.findOne({
                where: {
                    branch_id
                }
            })

            if (!branch) throw new response.error(404, "Branch doesn't exist!")

            let categories = await request.db.categories.findAll({
                where: {
                    branch_id
                },
                include: {
                    model: request.db.products
                }
            })

            response.status(200).json({
                ok: true,
                data: {
                    products: categories
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