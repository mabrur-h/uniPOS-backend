export default class Models {
    static async UserModel(sequelize, Sequelize) {
        return sequelize.define("users", {
            user_id: {
                type: Sequelize.DataTypes.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            user_name: {
                type: Sequelize.DataTypes.STRING(32),
                allowNull: false,
            },
            user_phone: {
                type: Sequelize.DataTypes.STRING(13),
                is: /^998[389][012345789][0-9]{7}$/,
                allowNull: false,
                unique: true
            },
            brand_name: {
              type: Sequelize.DataTypes.STRING(32),
              allowNull: true
            },
            user_role: {
                type: Sequelize.DataTypes.ENUM,
                values: ["OWNER", "WORKER", "ADMIN"],
                defaultValue: "OWNER"
            },
            user_attempts: {
                type: Sequelize.DataTypes.SMALLINT,
                allowNull: false,
                defaultValue: 0
            }
        });
    }
    static async SessionModel(sequelize, Sequelize) {
        return sequelize.define("sessions", {
            session_id: {
                type: Sequelize.DataTypes.UUID,
                defaultValue: Sequelize.DataTypes.UUIDV4,
                primaryKey: true,
            },
            session_inet: {
                type: Sequelize.DataTypes.INET,
                allowNull: false,
            },
            session_user_agent: {
                type: Sequelize.DataTypes.STRING(128),
                allowNull: false,
            },
        });
    }
    static async BanModel(sequelize, Sequelize) {
        return sequelize.define("bans", {
            ban_id: {
                type: Sequelize.DataTypes.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            expireDate: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false
            }
        })
    }
    static async AttemptsModel(sequelize, Sequelize) {
        return sequelize.define("attempts", {
            attempt_id: {
                type: Sequelize.DataTypes.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            user_code: {
                type: Sequelize.DataTypes.STRING(6),
                allowNull: true
            },
            user_attempts: {
                type: Sequelize.DataTypes.SMALLINT,
                allowNull: false,
                defaultValue: 0
            },
            is_expired: {
                type: Sequelize.DataTypes.BOOLEAN,
                defaultValue: false
            }
        })
    }
    static async BranchesModel(sequelize, Sequelize) {
        return sequelize.define('branches', {
            branch_id: {
                type: Sequelize.DataTypes.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            branch_name: {
                type: Sequelize.DataTypes.STRING(32),
                allowNull: false
            },
            branch_description: {
                type: Sequelize.DataTypes.STRING(256),
                allowNull: true
            },
            branch_longitude: {
                type: Sequelize.DataTypes.FLOAT,
                allowNull: false
            },
            branch_latitude: {
                type: Sequelize.DataTypes.FLOAT,
                allowNull: false
            },
            branch_owner: {
                type: Sequelize.DataTypes.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            }
        })
    }
    static async WorkersModel(sequelize, Sequelize) {
        return sequelize.define('branch_workers', {
            worker_id: {
                type: Sequelize.DataTypes.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4,
            },
            user_id: {
                type: Sequelize.DataTypes.UUID,
                allowNull: true
            }
        })
    }

    static async Relations(db) {
        await db.users.hasMany(db.sessions, {
            foreignKey: {
                name: "user_id",
                allowNull: false,
            },
        });
        await db.sessions.belongsTo(db.users, {
            foreignKey: {
                name: "user_id",
                allowNull: false,
            },
        });
        await db.users.hasMany(db.attempts, {
            foreignKey: {
                name: "user_id",
                allowNull: false
            }
        });
        await db.attempts.belongsTo(db.users, {
            foreignKey: {
                name: "user_id",
                allowNull: false
            }
        });
        await db.users.hasMany(db.bans, {
            foreignKey: {
                name: "user_id",
                allowNull: false
            }
        });
        await db.bans.belongsTo(db.users, {
            foreignKey: {
                name: "user_id",
                allowNull: false
            }
        })
        await db.workers.hasOne(db.users, {
            foreignKey: {
                name: "user_id",
                allowNull: false
            }
        })
        await db.users.belongsTo(db.workers, {
            foreignKey: {
                name: "user_id",
                allowNull: false
            }
        })
        await db.branches.hasMany(db.workers, {
            foreignKey: {
                name: "branch_id",
                allowNull: false
            }
        })
        await db.workers.belongsTo(db.branches, {
            foreignKey: {
                name: "branch_id",
                allowNull: false
            }
        })

    }
}