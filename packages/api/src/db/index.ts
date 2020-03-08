import { Sequelize, Model, BuildOptions } from 'sequelize';

import * as config from './config';
import * as User from './models/User';
import * as Recipient from './models/Recipient';

function isNodeEnvValid(env?: string): env is keyof typeof config {
  return !!env && env in config;
}

const env = process.env.NODE_ENV;

if (!isNodeEnvValid(env)) {
  throw new Error('invalid environment');
}

const seqConfig = config[env];

export const sequelize = new Sequelize(seqConfig);

function buildModel(seq: Sequelize) {
  return {
    User: User.build(seq),
    Recipient: Recipient.build(seq),
  };
}

export const models = buildModel(sequelize);

export type Models = ReturnType<typeof buildModel>;

type AvailableModelKeys = keyof Models;

type AvailableModels = Models[AvailableModelKeys];

type SequelizeInstanceType<TStatic> = TStatic extends typeof Model & {
  new (values?: Partial<infer U>, options?: BuildOptions): infer U;
}
  ? U
  : never;

export type AvailableModelInstanceTypes = SequelizeInstanceType<
  AvailableModels
>;

export type SequelizeStaticType<TInstance> = typeof Model & {
  new (values?: Partial<TInstance>, options?: BuildOptions): TInstance;
};

export type AnyModel = SequelizeStaticType<AvailableModelInstanceTypes>;
