'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => 
    Promise.all([
      queryInterface.addColumn('users', 'name', Sequelize.STRING, { }),
      queryInterface.addColumn('users', 'lastname', Sequelize.STRING, { }),
      queryInterface.addColumn('users', 'username', Sequelize.STRING, { }),
      queryInterface.addColumn('users', 'password', Sequelize.STRING, { })
    ])
  ,
  
  down: (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.removeColumn('users', 'name', { }),
      queryInterface.removeColumn('users', 'lastname', { }),
      queryInterface.addColumn('users', 'username', Sequelize.STRING, { }),
      queryInterface.addColumn('users', 'password', Sequelize.STRING, { })
    ])
  }
};
