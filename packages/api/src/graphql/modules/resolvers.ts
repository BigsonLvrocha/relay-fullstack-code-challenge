import lodash from 'lodash';

import auth from './auth/auth.resolvers';
import avatar from './avatar/avatar.resolvers';
import delivery from './delivery/delivery.resolvers';
import deliveryMan from './deliveryMan/deliveryMan.resolvers';
import deliveryProblem from './deliveryProblem/deliveries.resolvers';
import greet from './greet/greet.resolvers';
import node from './node/node.resolvers';
import recipient from './recipient/recipient.resolvers';
import scalars from './scalars/scalars.resolvers';
import user from './user/user.resolvers';

export default lodash.defaultsDeep(
  {},
  auth,
  avatar,
  delivery,
  deliveryMan,
  deliveryProblem,
  greet,
  node,
  recipient,
  scalars,
  user,
);
