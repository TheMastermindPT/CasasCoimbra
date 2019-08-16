/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Casa = sequelize.define(
    'Casa',
    {
      idCasa: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'idCasa'
      },
      numero: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'numero'
      },
      fotoMain: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'fotoMain'
      },
      nome: {
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'nome'
      },
      tipologia: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'tipologia'
      },
      wc: {
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'wc'
      },
      zona: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'zona'
      },
      morada: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'morada'
      },
      mobilado: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: '1',
        field: 'mobilado'
      },
      proximo: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'proximo'
      },
      netTv: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: '1',
        field: 'netTv'
      },
      despesas: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: '1',
        field: 'despesas'
      },
      mapa: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'mapa'
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
      }
    },
    {
      tableName: 'Casa',
      freezeTableName: true
    }
  );

  Casa.associate = function(models) {
    Casa.hasMany(models.Divisao, {
      foreignKey: 'CasaIdCasa',
      sourceKey: 'idCasa'
    });
    Casa.hasMany(models.Foto, {
      foreignKey: 'CasaIdCasa',
      sourceKey: 'idCasa'
    });
  };
  return Casa;
};
