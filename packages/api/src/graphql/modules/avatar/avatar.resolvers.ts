import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import { v4 } from 'uuid';
import { toGlobalId } from 'graphql-relay';

import { GQLResolvers } from '../../generated/schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const resolvers: GQLResolvers = {
  Mutation: {
    async uploadAvatar(_parent, args, ctx) {
      const fileData = await args.input.avatar;
      const extension = fileData.filename.split('.').pop();
      const filename = `${v4()}.${extension}`;
      const path = resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'tmp',
        'uploads',
        filename,
      );
      const streamIn = fileData.createReadStream();
      const streamOut = ctx.fs.createWriteStream(path);
      await new Promise((res, rej) => {
        streamIn.pipe(streamOut).on('finish', res).on('error', rej);
      });
      const avatar = await ctx.models.Avatar.create({
        original_name: fileData.filename,
        path: filename,
      });
      return {
        avatar,
      };
    },
  },
  Avatar: {
    _id({ id }) {
      return id;
    },
    id({ id }) {
      return toGlobalId('Avatar', id);
    },
    url({ path }) {
      return `http://localhost:8000/uploads/${path}`;
    },
  },
};

export default resolvers;
