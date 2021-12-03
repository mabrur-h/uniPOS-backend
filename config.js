import dotenv from 'dotenv';

dotenv.config();

export default {
    PG_CONNECTION_STRING: process.env.PG_CONNECTION_STRING,
    SECRET_WORD: process.env.SECRET_WORD
}