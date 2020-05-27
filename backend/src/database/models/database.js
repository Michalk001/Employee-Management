'use strict';

import { Sequelize } from "sequelize"
import UserModel from "./user"
import ProjectModel from "./project"
import UserProjectModel from "./userProject"
import MessageModel from "./message"


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
const Message = MessageModel(sequelize, Sequelize) 

  
Message.belongsTo(User, { as: "sender", foreignKey: 'senderId' }); 

Message.belongsTo(User, { as: "recipient" , foreignKey: 'recipientId' });

User.belongsToMany(Project, { through: UserProject });
Project.belongsToMany(User, { through: UserProject });




database.sequelize = sequelize;
database.Sequelize = Sequelize;
database.user = User;
database.project = Project;
database.userProject = UserProject;
database.message = Message;




export default database;
