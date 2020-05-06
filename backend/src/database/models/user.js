export default (sequelize, type) => {
  const User = sequelize.define('users', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: type.DataTypes.UUID,
      defaultValue: type.UUIDV4,

    },
    firstname: type.STRING,
    lastname: type.STRING,
    username: type.STRING,
    email: type.STRING,
    phone: type.STRING,
    password: type.STRING,
    isRetired: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
    isRemove: {
      type: type.BOOLEAN,
      defaultValue: false,
    },
  /*  isAdmin: {
      type: type.BOOLEAN,
      defaultValue: false,
    }*/
  })



  return User


}