module.exports = (sequelize, DataTypes) => {

    return sequelize.define('albums', {

        album_name: {
            type: DataTypes.STRING,
            defaultValue: "",
            allowNull: false,
        },

        image_url:{
            type: DataTypes.STRING,
            defaultValue: "",
            allowNull: false,
        },

        user_id: {
            type: DataTypes.STRING,
            defaultValue: "",
            allowNull: false,
        },
        
    });
    
}
