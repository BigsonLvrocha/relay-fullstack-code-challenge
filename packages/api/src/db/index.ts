import Sequelize, { Model, BuildOptions } from 'sequelize';

import * as config from './config';
import * as User from './models/User';
import * as Recipient from './models/Recipient';
import * as Avatar from './models/Avatar';
import * as DeliveryMan from './models/DeliveryMan';
import * as Delivery from './models/Delivery';
import * as DeliveryProblem from './models/DeliveryProblem';

function isNodeEnvValid(env?: string): env is keyof typeof config {
  return !!env && env in config;
}

const env = process.env.NODE_ENV;

if (!isNodeEnvValid(env)) {
  throw new Error('invalid environment');
}

const seqConfig = config[env];

export const sequelize = new Sequelize.Sequelize(seqConfig);

function buildModel(seq: Sequelize.Sequelize) {
  const models = {
    User: User.build(seq),
    Recipient: Recipient.build(seq),
    Avatar: Avatar.build(seq),
    DeliveryMan: DeliveryMan.build(seq),
    Delivery: Delivery.build(seq),
    DeliveryProblem: DeliveryProblem.build(seq),
  };
  Object.keys(models).forEach((key) => {
    const modelKey = key as keyof typeof models;
    if (models[modelKey].associate) {
      models[modelKey].associate!(models);
    }
  });
  return models;
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

export type AvailableModelInstanceTypes =
  SequelizeInstanceType<AvailableModels>;

export type SequelizeStaticType<TInstance> = typeof Model & {
  new (values?: Partial<TInstance>, options?: BuildOptions): TInstance;
} & {
  associate?: (
    assocModels: Record<
      string,
      typeof Model & {
        new (values?: Partial<any>, options?: BuildOptions): any;
      }
    >,
  ) => void;
};

export type AnyModel = SequelizeStaticType<AvailableModelInstanceTypes>;
