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
        });

        const user_agent = request.headers["user-agent"];

        if (!session) throw new response.error(403, "Session already expired");

        if (session.dataValues.session_user_agent !== user_agent) {
            await request.db.sessions.destroy({
                where: {
                    session_id: data.session_id,
                },
            });
            throw new response.error(403, "Session expired");
        }

        if (session.user.user_role !== 'OWNER') throw new response.error(405, "Permission denied! You are not owner!")

        request.owner = session;

        next();
    } catch (error) {
        if (!error.statusCode)
            error = new response.error(403, "Invalid inputs");
        next(error);
    }
}