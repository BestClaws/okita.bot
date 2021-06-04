module.exports = (sequelize, DataTypes) => {

    return sequelize.define('say_logs', {

        requested_by: {
            type: DataTypes.STRING,
            defaultValue: "(none)",
            allowNull: false,
        },

        message: {
            type: DataTypes.STRING,
            defaultValue: "(none)",
            allowNull: false,
        },
    });
}