import pkg from "sequelize";
import { Sequelize } from "sequelize";
import Models from "../models/Models.js";

export async function postgres() {
	const sequelize = new Sequelize(process.env.DB_STRING, {
		logging: false,
		define: {
			freezeTableName: true,
		},
	});

	try {
		let db = {};
		db.users = await Models.UserModel(sequelize, Sequelize);
		db.sessions = await Models.SessionModel(sequelize, Sequelize);

		await Models.Relations(db);

		await sequelize.sync({ force: false });

		return db;
	} catch (error) {
		console.log(error);
	}
}