import { Op } from 'sequelize';
import { Models } from '../../db';

import Dataloader = require('dataloader');

export function getLoader(models: Models) {
  const userLoader = new Dataloader(async (ids: readonly string[]) => {
    const users = await models.User.findAll({
      where: {
        id: {
          [Op.in]: ids as string[],
        },
      },
      raw: true,
    });
    return ids.map(id => users.find(user => user.id === id) || null);
  });
  return userLoader;
}
