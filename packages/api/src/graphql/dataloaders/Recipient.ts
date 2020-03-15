import { Op } from 'sequelize';
import { Models } from '../../db';

import Dataloader = require('dataloader');

export function getLoader(models: Models) {
  return new Dataloader(async (ids: readonly string[]) => {
    const recipients = await models.Recipient.findAll({
      where: {
        id: {
          [Op.in]: ids as string[],
        },
      },
      raw: true,
    });
    return ids.map(
      id => recipients.find(user => user.id === id) || new Error('not found'),
    );
  });
}
