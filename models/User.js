/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'User',
    {
      iduser: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'iduser'
      },
      username: {
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'username'
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password'
      },
      foto: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'foto'
      },
      createdAt: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'createdAt'
      },
      updatedAt: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'updatedAt'
      }
    },
    {
      tableName: 'user'
    }
  );
};
