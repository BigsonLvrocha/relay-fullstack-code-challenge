import Sequelize, { Model } from 'sequelize';

import { SequelizeStaticType } from '..';

const { DataTypes } = Sequelize;

export interface DeliveryProblem extends Model {
  readonly id: string;
  delivery_id: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export type DeliveryProblemStatic = SequelizeStaticType<DeliveryProblem>;

export function build(sequelize: Sequelize.Sequelize) {
  const DeliveryProblemModel = sequelize.define(
    'delivery_problem',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      delivery_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'deliveries',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  ) as DeliveryProblemStatic;
  DeliveryProblemModel.associate = (models) => {
    models.DeliveryProblem.belongsTo(models.Delivery, {
      foreignKey: 'delivery_id',
    });
  };
  return DeliveryProblemModel;
}
