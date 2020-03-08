import { Op } from 'sequelize';
import { Models } from '../../db';

import Dataloader = require('dataloader');

export function getLoader(models: Models) {
  return new Dataloader(async (ids: readonly string[]) => {
    const users = await models.Recipient.findAll({
      where: {
        id: {
          [Op.in]: ids as string[],
        },
      },
      raw: true,
    });
    return users.sort((a, b) => {
      return (
        ids.findIndex(id => a.id === id) - ids.findIndex(id => b.id === id)
      );
    });
  });
}
