import { ErrorHandler } from "../helpers/handleError.js";
import {Validations} from "../modules/validations.js";
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
            const getPagination = (page, size) => {
                const limit = size ? +size : 20;
                const offset = page ? page * limit : 0;

                return { limit, offset };
            };

            const {name, long, lat, page, size} = await request.query

            const { limit, offset } = getPagination(page, size);


            let products = await request.db.products.findAndCountAll({
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
                },
                limit,
                offset
            })


            function calcCrow(lat1, lon1, lat2, lon2) {
                var R = 6371; // km
                var dLat = toRad(lat2-lat1);
                var dLon = toRad(lon2-lon1);
                var lat1 = toRad(lat1);
                var lat2 = toRad(lat2);

                var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                var d = R * c;
                return d;
            }

            // Converts numeric degrees to radians
            function toRad(Value) {
                return Value * Math.PI / 180;
            }

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

            let count = products.count
            let sortedData = sortByDistance(products.rows, points);

            sortedData = sortedData.map((el) => {
                return {
                    product_id: el.product_id,
                    product_name: el.product_name,
                    product_price: el.product_price,
                    product_count: el.product_count,
                    product_type: el.product_type,
                    product_share: el.product_share,
                    createdAt: el.createdAt,
                    updatedAt: el.updatedAt,
                    category: el.category,
                    distance: `${calcCrow(el.category.branch.branch_latitude, el.category.branch.branch_longitude, lat, long).toFixed(1)} km`
                }
            })

            response.status(200).json({
                ok: true,
                data: {
                    products_count: count,
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