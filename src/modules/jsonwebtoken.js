import JWT from "jsonwebtoken";
import config from "../config.js";

export function signJwtToken(data) {
    return JWT.sign(data, config.SECRET_WORD);
}

export function verifyJwtToken(token) {
    try {
        return JWT.verify(token, config.SECRET_WORD);
    } catch (error) {
        return false;
    }
}