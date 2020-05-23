export default (sequelize, type) => {
    const Message = sequelize.define('messages', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: type.DataTypes.UUID,
            defaultValue: type.UUIDV4,
        },
        sender: {
            type: type.UUID,
            allowNull: false,
            foreignKey:true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        recipient : {
            type: type.UUID,
            allowNull: false,
            foreignKey:true,
            references: {
                model: 'users',
                key: 'id'
            }
        },

        description: {
            type: type.STRING,
            defaultValue: "",
        },
        topic: {
            type: type.STRING,
            defaultValue: null,
        },
        isRemove: {
            type: type.BOOLEAN,
            defaultValue: false,
        },
        isRead:{
            type: type.BOOLEAN,
            defaultValue: false,
        }
    })


    return Message
} 