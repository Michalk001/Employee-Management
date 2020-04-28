export default (sequelize, type) => {
    const UserProject = sequelize.define('userProjects', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: type.DataTypes.UUID,
            defaultValue: type.UUIDV4,

        },
        userId: {
            type: type.UUID,
            allowNull: false,
            foreignKey:true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        projectId: {
            type: type.UUID,
            allowNull: false,
            foreignKey:true,
            references: {
                model: 'projects',
                key: 'id'
            }
        },
        hours:{
            type: type.INTEGER,
            defaultValue: 0
        },
        isRemove:{
            type: type.BOOLEAN,
            defaultValue: false,
        }
    })
 


    return UserProject

    
}