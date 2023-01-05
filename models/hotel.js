'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hotel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Hotel.hasMany(models.TravelStep_Destination, {
        foreignKey: "HotelId",
      })
    }
  }
  Hotel.init({
    name: DataTypes.STRING,
    image: DataTypes.TEXT,
    geocoding: DataTypes.STRING,
    isRecommended: DataTypes.BOOLEAN,
    price: DataTypes.INTEGER,
    CityId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Hotel',
  });
  return Hotel;
};