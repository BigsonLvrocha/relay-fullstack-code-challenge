import { Model, Sequelize, DataTypes } from 'sequelize';

import { SequelizeStaticType } from '..';
import { GQLBrState } from '../../graphql/generated/schema';

export interface Recipient extends Model {
  readonly id: string;
  street: string;
  number: number | undefined | null;
  complement: string | undefined | null;
  state: GQLBrState;
  city: string;
  cep: string;
  created_at: Date;
  updated_at: Date;
}

export type RecipientStatic = SequelizeStaticType<Recipient>;

export function build(sequelize: Sequelize) {
  const Recipient = sequelize.define(
    'recipient',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
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
        type: DataTypes.ENUM(
          'AC',
          'AL',
          'AP',
          'AM',
          'BA',
          'CE',
          'DF',
          'ES',
          'GO',
          'MA',
          'MT',
          'MS',
          'MG',
          'PA',
          'PB',
          'PR',
          'PE',
          'PI',
          'RJ',
          'RN',
          'RS',
          'RO',
          'RR',
          'SC',
          'SP',
          'SE',
          'TO',
        ),
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
  return Recipient;
}
