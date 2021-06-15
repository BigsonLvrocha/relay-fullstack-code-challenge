import Sequelize, { Model } from 'sequelize';

import { SequelizeStaticType } from '..';
import { Unarray } from '../../utils/types';

const { DataTypes } = Sequelize;

const statesEnum = [
  'AC' as const,
  'AL' as const,
  'AP' as const,
  'AM' as const,
  'BA' as const,
  'CE' as const,
  'DF' as const,
  'ES' as const,
  'GO' as const,
  'MA' as const,
  'MT' as const,
  'MS' as const,
  'MG' as const,
  'PA' as const,
  'PB' as const,
  'PR' as const,
  'PE' as const,
  'PI' as const,
  'RJ' as const,
  'RN' as const,
  'RS' as const,
  'RO' as const,
  'RR' as const,
  'SC' as const,
  'SP' as const,
  'SE' as const,
  'TO' as const,
];

export interface Recipient extends Model {
  readonly id: string;
  name: string;
  street: string;
  number: number | undefined | null;
  complement: string | undefined | null;
  state: Unarray<typeof statesEnum>;
  city: string;
  cep: string;
  created_at: Date;
  updated_at: Date;
}

export type RecipientStatic = SequelizeStaticType<Recipient>;

export function build(sequelize: Sequelize.Sequelize) {
  const RecipientModel = sequelize.define(
    'recipient',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      street: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      number: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      complement: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.ENUM(...statesEnum),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cep: {
        type: DataTypes.CHAR(8),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  ) as RecipientStatic;
  return RecipientModel;
}
