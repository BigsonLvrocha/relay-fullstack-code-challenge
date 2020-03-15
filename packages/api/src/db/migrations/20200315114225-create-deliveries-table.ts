import { QueryInterface, DataTypes } from 'sequelize';

export async function up(q: QueryInterface) {
  await q.createTable('deliveries', {
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
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
}
