export default (sequelize, type) => {
    const Project = sequelize.define('projects', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: type.DataTypes.UUID,
            defaultValue: type.UUIDV4,
        },
        description: type.STRING,
        name: type.STRING,
        isRetired:{
            type: type.BOOLEAN,
            defaultValue: false,
        },
        isRemove: {
            type: type.BOOLEAN,
            defaultValue: false,
        }

    })


    return Project
} 