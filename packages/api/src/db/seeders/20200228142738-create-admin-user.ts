import { hashSync } from 'bcrypt';
import { QueryInterface } from 'sequelize';
import { v4 } from 'uuid';

export async function up(q: QueryInterface) {
  await q.bulkInsert('users', [
    {
      id: v4(),
      name: 'Distribuidora FastFeet',
      email: 'admin@fastfeet.com',
      password_hash: hashSync('123456', 10),
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}
