import { verifyJwtToken } from "../modules/jsonwebtoken.js";

export default async function OwnerMiddleware(request, response, next) {
    try {
        if (!request.headers["authorization"]) {
            throw new response.error(403, "Token not found");
        }

        const data = verifyJwtToken(request.headers["authorization"]);

        if (!data) throw new response.error(403, "Invalid token");

        const session = await request.db.sessions.findOne({
            where: {
                session_id: data.session_id,
            },
            include: {
                model: request.db.users
            }
        });

        if (!session) throw new response.error(403, "Session already expired");

        if (session.user.user_role !== 'OWNER') throw new response.error(405, "Permission denied! You are not owner!")

        request.owner = session;

        next();
    } catch (error) {
        console.log(error)
        if (!error.statusCode)
            error = new response.error(403, "Invalid inputs");
        next(error);
    }
}