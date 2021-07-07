import lodash from 'lodash';
import delivery from './delivery/delivery.validators';
import deliveryMan from './deliveryMan/deliveryMan.validators';
import deliveryProblem from './deliveryProblem/deliveries.validators';
import recipient from './recipient/recipient.validators';

export default lodash.defaultsDeep(
  {},
  delivery,
  deliveryMan,
  deliveryProblem,
  recipient,
);
