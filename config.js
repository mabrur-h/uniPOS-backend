import dotenv from 'dotenv';

dotenv.config();

export default {
    DB_STRING: process.env.DB_STRING,
    SECRET_WORD: process.env.SECRET_WORD,
    PORT: process.env.PORT
}