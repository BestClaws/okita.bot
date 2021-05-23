

module.exports = (sequelize, DataTypes) => {

    return sequelize.define('user_points', {
        user_id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },

        points: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        }
    });

    
}
