'use strict';

import { Sequelize } from "sequelize"
import UserModel from "./user"
import ProjectModel from "./project"
import UserProjectModel from "./userProject"


const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const database = {};


let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}


const User = UserModel(sequelize, Sequelize)
const Project = ProjectModel(sequelize, Sequelize)
const UserProject = UserProjectModel(sequelize, Sequelize)
database.sequelize = sequelize;
database.Sequelize = Sequelize;
database.user = User;
database.project = Project;
database.userProject = UserProject;

User.belongsToMany(Project, { through: UserProject });
Project.belongsToMany(User, { through: UserProject });

sequelize.sync({ force: false })
  .then(() => {
    console.log(`Database & tables created!`)
  })


module.exports = database;
 