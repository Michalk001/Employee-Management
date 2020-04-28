export default (sequelize, type) => {
  const User = sequelize.define('users', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: type.DataTypes.UUID,
      defaultValue: type.UUIDV4,

    },
    name: type.STRING,
    lastname: type.STRING,
    username: type.STRING,
    password: type.STRING,
    isRemove: {
      type: type.BOOLEAN,
      defaultValue: false,
    }
  })



  return User


}