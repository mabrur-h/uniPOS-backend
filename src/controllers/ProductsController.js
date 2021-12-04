import { ErrorHandler } from "../helpers/handleError.js";
import {Validations} from "../modules/validations.js";
import sortByDistance from 'sort-by-distance';
import pkg from 'sequelize'
const { Op } = pkg

export default class ProductsController {
    static async AddNewProduct(request, response, next) {
        try {
            const { products } = await request.body

            for (let product of products) {
                await request.db.products.create({
                    product_name: product.product_name,
                    product_price: product.product_price,
                    product_barcode: product.product_barcode,
                    product_count: product.product_count,
                    product_type: product.product_type,
                    category_id: product.category_id,
                    product_id: product.product_id
                })
            }

            response.status(201).json({
                ok: true,
                message: "Products created successfully!"
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
    static async FindNearestProducts(request, response, next) {
        try {
            const {name, long, lat} = await request.query

            let products = await request.db.products.findAll({
                where: {
                    product_name: {
                        [Op.iLike]: `%${name}%`
                    }
                },
                attributes: {
                    exclude: ['product_barcode']
                },
                include: {
                    model: request.db.categories,
                    include: {
                        model: request.db.branches,
                        attributes: {
                            exclude: ['branch_owner']
                        }
                    }
                }
            })

            // let opts = {
            //     yName: 'category.branch.branch_latitude',
            //     xName: 'category.branch.branch_longitude'
            // }
            //
            // let origin = { longitude: long, latitude: lat }
            //
            // let sortedProducts = sortByDistance(origin, products, opts)

            const distance = (coor1, coor2) => {
                const x = coor2.x - coor1.category.branch.branch_longitude;
                const y = coor2.y - coor1.category.branch.branch_latitude;
                return Math.sqrt((x * x) + (y * y));
            };
            const sortByDistance = (coordinates, point) => {
                const sorter = (a, b) => distance(a, point) - distance(b, point);
                return coordinates.sort(sorter);
            };

            const points = {
                x: long,
                y: lat
            }

            let sortedData = sortByDistance(products, points);


            response.status(200).json({
                ok: true,
                data: {
                    products: sortedData
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