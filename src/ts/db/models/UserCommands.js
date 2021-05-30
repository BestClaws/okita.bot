module.exports = (sequelize, DataTypes) => {

    return sequelize.define('user_commands', {

        command_name: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },

        command_value: {
            type: DataTypes.STRING,
            defaultValue: "",
            allowNull: false,
        },

        command_guild:{
            type: DataTypes.STRING,
            defaultValue: "",
            allowNull: false,
        },

        command_author: {
            type: DataTypes.STRING,
            defaultValue: "",
            allowNull: false,
        },
        
    });

    
}
