import { ErrorHandler } from "../helpers/handleError.js";

export default class HomeController {
    static async HomeGetController(request, response, next) {
        try {
            response.status(200).json({
                ok: true,
                appName: "uniPOS",
                version: "0.0.1",
                documentation: "https://documenter.getpostman.com/view/15142300/UVJhDa5f",
            });
        } catch (error) {
            console.log(error)
            next(error);
        }
    }
}