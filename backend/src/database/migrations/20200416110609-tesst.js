'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => 
    Promise.all([

      queryInterface.addColumn('users', 'isAdmin', Sequelize.BOOLEAN, { })
    ])
  ,
  
  down: (queryInterface, Sequelize) => {
    Promise.all([
 
      queryInterface.addColumn('users', 'isAdmin', Sequelize.BOOLEAN, { })
    ])
  }
};
