/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Divisao = sequelize.define(
    'Divisao',
    {
      idDivisao: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'idDivisao'
      },
      tipo: {
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'tipo'
      },
      numero: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        field: 'numero'
      },
      descricao: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'descricao'
      },
      preco: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        field: 'preco'
      },
      disponivel: {
        type: DataTypes.INTEGER(4),
        allowNull: true,
        field: 'disponivel'
      },
      quando: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: 'quando'
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
        plural: 'divisao',
        singular: 'divisao'
      },
      tableName: 'Divisao'
    }
  );

  Divisao.associate = function(models) {
    Divisao.belongsTo(models.Casa, {
      foreignKey: 'CasaIdCasa',
      targetKey: 'idCasa'
    });
    Divisao.hasMany(models.Foto, {
      foreignKey: 'DivisaoIdDivisao',
      sourceKey: 'idDivisao'
    });
  };

  return Divisao;
};
