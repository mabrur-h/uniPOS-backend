import pkg from "sequelize";
const { Op } = pkg;
import RN from 'random-number';
import { v4 as uuidv4 } from 'uuid'
import { compareHash, createNewHash } from "../modules/bcrypt.js";
import { signJwtToken } from "../modules/jsonwebtoken.js";
import { Validations } from "../modules/validations.js";

export default class UserController {
    static async UserCreateAccount(request, response, next) {
        try {
            const { user_name, user_phone, brand_name } = await (
                await Validations.UserCreateAccountValidation()
            ).validateAsync(request.body);

            let userIsExist = await request.db.users.findOne({
                where: {
                    user_phone: {
                        [Op.iLike]: `%${user_phone}%`
                    }
                }
            });

            if (userIsExist) throw new response.error(400, "This phone is already exists");

            let newUser = await request.db.users.create({
                user_name,
                user_phone,
                brand_name
            });

            let user = await request.db.users.findOne({
                where: {
                    user_id: newUser.user_id
                }
            })

            const gen = RN.generator({
                min: 10000,
                max: 99999,
                integer: true
            })

            const genNumber = gen()

            let attempt = await request.db.attempts.create({
                user_code: genNumber,
                user_id: user.user_id
            })

            response.status(201).json({
                ok: true,
                message: "We`ve sent a sms with a confirmation code to your mobile phone. Please enter the 5-digit code below.",
                data: {
                    id: attempt.attempt_id,
                    code: genNumber,
                    user
                }
            });
        } catch (error) {
            console.log(error)
            if (!error.statusCode)
                error = new response.error(400, "Invalid inputs");
            next(error);
        }
    }
    static async UserValidateCode(request, response, next) {
        try {
            let validationId = request.headers["code-validation-id"]

            if (!validationId) throw new response.error(404, "Invalid validation token");

            const attempt = await request.db.attempts.findOne({
                where: {
                    attempt_id: validationId
                },
                include: {
                    model: request.db.users
                }
            })

            if (!attempt) throw new response.error(400, "Validation code is not found!");

            const { code } = await (
                await Validations.UserValidateCodeValidation()
            ).validateAsync(request.body);

            if (Number(code) !== Number(attempt.user_code)) throw new response.error(404, "Validate code is incorrect!")

            let userAgent = request.headers['user-agent'];
            let ipAddress = request.headers["x-forwarded-for"] || request.connection.remoteAddress;

            if (!(userAgent && ipAddress)) throw new response.error(400, "Invalid device!")

            const session = await request.db.sessions.create({
                user_id: attempt.user_id,
                session_inet: ipAddress,
                session_user_agent: userAgent
            });

            const token = await signJwtToken({
                session_id: session.session_id,
            });

            await request.db.attempts.destroy({
                where: {
                    user_id: attempt.user_id
                }
            });

            await request.db.attempts.update({
                user_attempts: 0
            }, {
                where: {
                    user_id: attempt.user_id
                }
            })

            let userData = await request.db.users.findOne({
                where: {
                    user_id: attempt.user_id
                }
            })

            response.status(201).json({
                ok: true,
                message: "Successfully logged in!",
                data: {
                    token,
                    user: userData
                }
            })
        } catch (error) {
            if (!error.statusCode)
                error = new response.error(400, "Invalid inputs");
            next(error);
        }
    }
    static async UserLoginAccount(request, response, next) {
        try {
            const { user_phone } = await (
                await Validations.UserLoginAccountValidation()
            ).validateAsync(request.body);

            const user = await request.db.users.findOne({
                where: {
                    user_phone: user_phone,
                },
                raw: true,
            });

            if (!user) throw new response.error(400, "User Not found");

            const gen = RN.generator({
                min: 10000,
                max: 99999,
                integer: true
            })

            const genNumber = gen()

            let attempt = await request.db.attempts.create({
                user_code: genNumber,
                user_id: user.user_id
            })

            response.status(200).json({
                ok: true,
                message: "We`ve sent a sms with a confirmation code to your mobile phone. Please enter the 5-digit code below.",
                data: {
                    id: attempt.attempt_id,
                    code: genNumber
                }
            });
        } catch (error) {
            console.log(error)
            if (!error.statusCode)
                error = new response.error(400, "Invalid inputs");
            next(error);
        }
    }
    static async UserGetMyAccount(request, response, next) {
        try {
            const user = await request.db.users.findOne({
                where: {
                    user_id: request.session.user_id,
                }
            });

            if (!user) throw new response.error(404, "User not found!")

            response.json({
                ok: true,
                data: {
                    user
                },
            });
        } catch (error) {
            if (!error.statusCode)
                error = new response.error(400, "Invalid inputs");
            next(error);
        }
    }
    static async UserAddWorker(request, response, next) {
        try {
            const { workers, branch } = await request.body

            for (let worker of workers) {
                let userIsExist = await request.db.users.findOne({
                    where: {
                        user_phone: {
                            [Op.iLike]: `%${worker.user_phone}%`
                        }
                    }
                });


                if (userIsExist?.user_role === 'OWNER') {
                    await new response.error(405, "This user is owner!")
                }
            }

            for (let worker of workers) {
                let newUser = await request.db.users.create({
                    user_name: worker.user_name,
                    user_phone: worker.user_phone,
                    user_role: "WORKER"
                })

                await request.db.workers.create({
                    user_id: newUser.user_id,
                    branch_id: branch
                })
            }

            response.json({
                ok: true,
                message: "Workers created successfully!"
            });
        } catch (error) {
            console.log(error)
            if (!error.statusCode)
                error = new response.error(400, "Invalid inputs");
            next(error);
        }
    }
}