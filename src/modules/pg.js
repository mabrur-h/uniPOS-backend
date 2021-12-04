import pkg from "sequelize";
import { Sequelize } from "sequelize";
import Models from "../models/Models.js";
import config from "../../config.js";

export async function postgres() {
	const sequelize = new Sequelize(config.DB_STRING, {
		logging: false,
		define: {
			freezeTableName: true,
		},
	});

	try {
		let db = {};
		db.users = await Models.UserModel(sequelize, Sequelize);
		db.sessions = await Models.SessionModel(sequelize, Sequelize);
		db.bans = await Models.BanModel(sequelize, Sequelize);
		db.attempts = await Models.AttemptsModel(sequelize, Sequelize);
		db.branches = await Models.BranchesModel(sequelize, Sequelize);
		db.workers = await Models.WorkersModel(sequelize, Sequelize);

		await Models.Relations(db);

		await sequelize.sync({ force: false });

		return db;
	} catch (error) {
		console.log(error);
	}
}