/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Foto = sequelize.define(
    'Foto',
    {
      idFoto: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'idFoto'
      },
      path: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'path'
      },
      createdAt: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'createdAt'
      },
      updatedAt: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'updatedAt'
      },
      CasaIdCasa: {
        type: DataTypes.INTEGER(11),
        references: {
          model: 'Casa',
          references: 'idCasa'
        },
        field: 'CasaIdCasa'
      }
    },
    {
      name: {
        plural: 'fotos',
        singular: 'foto'
      },
      tableName: 'foto'
    }
  );

  Foto.associate = function(models) {
    Foto.belongsTo(models.Divisao);
    Foto.belongsTo(models.Casa);
  };

  return Foto;
};
