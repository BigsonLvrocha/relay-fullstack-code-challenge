import lodash from 'lodash';

import auth from './auth/auth.shield';
import delivery from './delivery/delivery.shield';
import deliveryMan from './deliveryMan/deliveryMan.shield';
import deliveryProblem from './deliveryProblem/deliveryProblem.shield';
import greet from './greet/greet.shield';

export default lodash.defaultsDeep(
  {},
  auth,
  delivery,
  deliveryMan,
  deliveryProblem,
  greet,
);
