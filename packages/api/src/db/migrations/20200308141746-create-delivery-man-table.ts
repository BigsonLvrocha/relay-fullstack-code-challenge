import { QueryInterface, DataTypes } from 'sequelize';

export async function up(q: QueryInterface) {
  await q.createTable('delivery_man', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    avatar_id: {
      type: DataTypes.UUID,
      references: {
        model: 'avatars',
        key: 'id',
      },
      onDelete: 'SET_NULL',
      onUpdate: 'CASCADE',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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

export async function down(q: QueryInterface) {
  await q.dropTable('delivery_man');
}
