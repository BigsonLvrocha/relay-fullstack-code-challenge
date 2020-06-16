import { Model, Sequelize, DataTypes } from 'sequelize';

import { SequelizeStaticType } from '..';

export interface Delivery extends Model {
  readonly id: string;
  recipient_id: string;
  delivery_man_id: string;
  signature_id?: string | null;
  product: string;
  canceled_at?: Date | null;
  start_date?: Date | null;
  end_date?: Date | null;
  readonly created_at: Date;
  readonly updated_at: Date;
}

export type DeliveryStatic = SequelizeStaticType<Delivery>;

export function build(sequelize: Sequelize) {
  const Delivery = sequelize.define(
    'delivery',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      recipient_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'recipients',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      delivery_man_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'delivery_mans',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      signature_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'avatars',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      product: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      canceled_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  ) as DeliveryStatic;

  Delivery.associate = models => {
    models.Delivery.belongsTo(models.DeliveryMan, {
      foreignKey: 'delivery_man_id',
    });
    models.Delivery.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
    });
    models.Delivery.belongsTo(models.Avatar, {
      foreignKey: 'signature_id',
    });
    models.Delivery.hasMany(models.DeliveryProblem, {
      foreignKey: 'delivery_id',
    });
  };

  return Delivery;
}
